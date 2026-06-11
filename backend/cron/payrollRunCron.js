import cron from 'node-cron';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import pLimit from "p-limit";

dayjs.extend(utc);
dayjs.extend(timezone);

const DAY_MAP = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

const isPayDay = (settings, now, lastRunDate) => {
    const config = typeof settings.payFrequencyConfig === 'string' ? JSON.parse(settings.payFrequencyConfig) : settings.payFrequencyConfig;

    switch (settings.payrollCycle) {
        case "monthly": {
            const payrollEndDay = Number(config.payrollEndDay);
            const lastDayofMonth = now.daysInMonth();
            const effectiveEndDay = payrollendDay === 31 ? lastDayofMonth : payrollEndDay;
            return now.date() === effectiveEndDay;
        }
        case "weekly": {
            const payDayNumber = DAY_MAP[config.paymentDate.toLowerCase()];
            return now.day() === payDayNumber;
        }
        case "biweekly": {
            const payDayNumber = DAY_MAP[config.paymentDate.toLowerCase()];
            if(now.day() !== payDayNumber) return false;
            if (lastRunDate) {
                const diffDays = now.startOf("day").diff(dayjs(lastRunDate), "day");
                if (diffDays < 14) return false;
            }

            // Anchor check
            const tz = settings.orgProfile?.timezone || "Asia/Kolkata";
            let anchor = dayjs(settings.effectiveFrom).tz(tz).startOf("day");
            const diff = (payDayNum - anchor.day() + 7) % 7;
            anchor = anchor.add(diff, "day");
            const diffDays = now.startOf("day").diff(anchor, "day");
            return diffDays >= 0 && diffDays % 14 === 0;
        }

        default: return false;
    }
}

const buildPayrollParams = (settings, now) => {
  const config = typeof settings.cycleConfig === "string"
    ? JSON.parse(settings.cycleConfig)
    : settings.cycleConfig;

  switch (settings.payrollCycle) {

    case "monthly":
      return { month: now.format("YYYY-MM") };

    case "weekly": {
      const startDayNum = DAY_MAP[config.payrollStartDay?.toLowerCase()] ?? 1;
      const daysBack    = (now.day() - startDayNum + 7) % 7;
      return {
        startDate: now.subtract(daysBack, "day").format("YYYY-MM-DD"),
        endDate:   now.format("YYYY-MM-DD"),
      };
    }

    case "biweekly": {
      const tz        = settings.orgTimezone || "Asia/Kolkata";
      const payDayNum = DAY_MAP[config.paymentDate?.toLowerCase()];

      let anchor = dayjs(settings.effectiveFrom).tz(tz).startOf("day");
      const anchorDiff = (payDayNum - anchor.day() + 7) % 7;
      anchor = anchor.add(anchorDiff, "day");

      const totalDays   = now.startOf("day").diff(anchor, "day");
      const cycleOffset = totalDays % 14;
      const periodStart = now.subtract(cycleOffset, "day");

      const cutoffOffset = Number(config.attendanceCutoffOffset ?? 0);

      return {
        startDate: periodStart.format("YYYY-MM-DD"),
        endDate:   now.subtract(cutoffOffset, "day").format("YYYY-MM-DD"),
      };
    }
  }
}

const processOrganizationPayrollRun = async (org, systemUserId) => {
    const lastRunDate = settings.payrollRuns?.[0]?.createdAt ?? null;
    const tz = org.timezone || 'Asia/Kolkata';
    const now = dayjs().tz(tz);

    if(now.hour !== 0 || now.minute > 10) {
        console.log(`[Org ${org.orgId}] Skipping — not within the first 10 minutes of the day in org timezone (${tz})`);
        return;
    }
    const activeSettings = org.payrollSettings[0];
    
    if(!activeSettings || !isPayDay(activeSettings, now, lastRunDate)) {
        console.log(`[Org ${org.orgId}] Skipping — not a pay day in org timezone (${tz})`);
        return;
    }

    const params = buildPayrollParams(activeSettings, now);
    await runPayrollService({
        orgId: org.orgId,
        userId: systemUserId,
        now: now.toDate(),
        orgProfile: { id: org.id, orgId: org.orgId },
        activeSettings: settings,
        lastRunDate,
        ...params,
    });

    console.log(`[Cron] ✅ Org ${org.orgId} | ${settings.payrollCycle}`);
}

let cronRunning = false;

cron.schedule('*/10 * * * *', async () => {

    console.log('Running Payroll Run Cron Job...');

    if (cronRunning) {
        console.log("[Cron] Skipping — previous run still active");
        return;
    }
    cronRunning = true;
    try {
    //fetch the orgs with active payroll settings and their timezone
    const organizations = await prisma.orgProfile.findMany({
        where: { payrollSettings: {some: { status: 'ACTIVE'}}},
        select: {
            id: true,
            orgId: true,
            timezone: true,
            payrollSettings: {
                where: { status: 'ACTIVE' },
                orderBy: { effectiveFrom: "desc" },
                take: 1,
                include: {
                    //Grab last completed run right here — no extra query
                    payrollRuns: {
                        where: { status: "COMPLETED" },
                        orderBy: { createdAt: "desc" },
                        take: 1,
                        select: { createdAt: true },
                    },
                },

            },
        }
    });

    if(organizations.length === 0) {
        console.log('No organizations with active payroll settings found.');
        return;
    };

        const systemUser = await prisma.user.findFirst({
            where: { role: "Admin" },
            select: { id: true },
        });

        if (!systemUser) {
            console.error("[Cron] No Admin user found — cannot run payroll");
            return;
        }

    const limit = pLimit(5);

    await Promise.allSettled(
        organizations.map((org) => limit(async() => {
            try {
                await processOrganizationPayrollRun(org, systemUser.id);
            } catch (error) {
                console.error('Error occurred while processing organization promise:', error);
            }
        }))
    )
    
    } catch (error) {
        console.error('Error occurred while running Payroll Run Cron Job:', error);
    } finally {
        cronRunning = false;
    }
});