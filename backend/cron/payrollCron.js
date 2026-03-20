import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

cron.schedule("*/10 * * * *", async () => {
  console.log("Running Payroll Cron Job...");

  try {
    // ✅ Get all org profiles with timezone
    const orgProfiles = await prisma.orgProfile.findMany({
      select: {
        id: true,
        timezone: true
      }
    });

    for (const org of orgProfiles) {

      const now = dayjs().tz(org.timezone);

      // ✅ Run only at midnight (0:00 - 0:10 window)
      if (now.hour() !== 0 || now.minute() > 10) continue;

      const today = now.startOf("day").toDate();

      // ✅ Get scheduled payrolls for this org
      const payrolls = await prisma.payrollSettings.findMany({
        where: {
          orgProfileId: org.id,
          status: "SCHEDULED",
          effectiveFrom: { lte: today }
        },
        orderBy: { effectiveFrom: "asc" }
      });

      if (!payrolls.length) continue;

      await prisma.$transaction(async (tx) => {

        const latestPayroll = payrolls[payrolls.length - 1];

        // Expire current active
        await tx.payrollSettings.updateMany({
          where: {
            orgProfileId: org.id,
            status: "ACTIVE"
          },
          data: {
            status: "EXPIRED",
            isLocked: true,
            effectiveTo: latestPayroll.effectiveFrom
          }
        });

        // Activate latest
        await tx.payrollSettings.update({
          where: { id: latestPayroll.id },
          data: {
            status: "ACTIVE",
            isLocked: true
          }
        });

      });

      console.log(`Activated payroll for org ${org.id} (${org.timezone})`);
    }

    console.log("Payroll Cron Completed ✅");

  } catch (error) {
    console.log("Cron Error ❌", error);
  }
});