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
    const orgProfiles = await prisma.orgProfile.findMany({
      select: {
        id: true,
        timezone: true
      }
    });

    for (const org of orgProfiles) {

      const timezone = org.timezone || "UTC";
      const now = dayjs().tz(timezone);

      // Run only between 00:00 and 00:10
      if (now.hour() !== 0 || now.minute() > 10) {
        console.log(`Skipping payroll for org ${org.id} (${org.timezone}) - Not midnight`);
        continue;
      }

      const today = now.startOf("day").toDate();

      const payrolls = await prisma.payrollSettings.findMany({
        where: {
          orgProfileId: org.id,
          status: "SCHEDULED",
          effectiveFrom: { lte: today }
        },
        orderBy: {
          effectiveFrom: "asc"
        }
      });

      if (!payrolls.length) continue;

      const payrollToActivate = payrolls[0];

      await prisma.$transaction(async (tx) => {

        await tx.payrollSettings.updateMany({
          where: {
            orgProfileId: org.id,
            status: "ACTIVE"
          },
          data: {
            status: "EXPIRED",
            isLocked: true,
            effectiveTo: dayjs(payrollToActivate.effectiveFrom)
              .subtract(1, "day")
              .toDate()
          }
        });

        await tx.payrollSettings.update({
          where: {
            id: payrollToActivate.id
          },
          data: {
            status: "ACTIVE",
            isLocked: true
          }
        });

      });

      console.log(`Activated payroll for org ${org.id}`);
    }

  } catch (error) {
    console.error("Cron Error ❌", error);
  }
});