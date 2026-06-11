// ─── jobs/payrollCron.js ─────────────────────────────────────────────────────

import cron     from "node-cron";
import dayjs    from "dayjs";
import utc      from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import pLimit   from "p-limit";
import { PrismaClient } from "@prisma/client";
import { runPayrollService } from "../middleware/runPayrollService.js"

const prisma = new PrismaClient();
dayjs.extend(utc);
dayjs.extend(timezone);

const DAY_MAP = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

// ── isPayDay ──────────────────────────────────────────────────────────────────
function isPayDay(settings, now, lastRunDate) {
  const config = typeof settings.cycleConfig === "string"
    ? JSON.parse(settings.cycleConfig)
    : settings.cycleConfig;

  switch (settings.payrollCycle) {

    case "monthly": {
      const payrollEndDay   = Number(config.payrollEndDay);
      const lastDayOfMonth  = now.daysInMonth();
      const effectiveEndDay = payrollEndDay === 31 ? lastDayOfMonth : payrollEndDay;
      return now.date() === effectiveEndDay;
    }

    case "weekly": {
      const payDayNum = DAY_MAP[config.paymentDate?.toLowerCase()];
      return now.day() === payDayNum;
    }

    case "biweekly": {
      const payDayNum = DAY_MAP[config.paymentDate?.toLowerCase()];
      if (now.day() !== payDayNum) return false;

      // 14-day gap check using last completed run
      if (lastRunDate) {
        const diffDays = now.startOf("day").diff(dayjs(lastRunDate), "day");
        if (diffDays < 14) return false;
      }

      // Anchor-based 14-day cycle check
      const tz   = settings.orgProfile?.timezone || "Asia/Kolkata";
      let anchor = dayjs(settings.effectiveFrom).tz(tz).startOf("day");
      const diff = (payDayNum - anchor.day() + 7) % 7;
      anchor     = anchor.add(diff, "day");

      const diffDays = now.startOf("day").diff(anchor, "day");
      return diffDays >= 0 && diffDays % 14 === 0;
    }

    default:
      return false;
  }
}

// ── buildPayrollParams ────────────────────────────────────────────────────────
function buildPayrollParams(settings, now) {
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
      const tz        = settings.orgProfile?.timezone || "Asia/Kolkata";
      const payDayNum = DAY_MAP[config.paymentDate?.toLowerCase()];

      let anchor       = dayjs(settings.effectiveFrom).tz(tz).startOf("day");
      const anchorDiff = (payDayNum - anchor.day() + 7) % 7;
      anchor           = anchor.add(anchorDiff, "day");

      const totalDays    = now.startOf("day").diff(anchor, "day");
      const cycleOffset  = totalDays % 14;
      const periodStart  = now.subtract(cycleOffset, "day");
      const cutoffOffset = Number(config.attendanceCutoffOffset ?? 0);

      return {
        startDate: periodStart.format("YYYY-MM-DD"),
        endDate:   now.subtract(cutoffOffset, "day").format("YYYY-MM-DD"),
      };
    }
  }
}

// ── Step 1: Activate any scheduled payroll settings for this org ──────────────
async function activateScheduledPayroll(org, now) {
  const today = now.startOf("day").toDate();

  const scheduledPayrolls = await prisma.payrollSettings.findMany({
    where: {
      orgProfileId:  org.id,
      status:        "SCHEDULED",
      effectiveFrom: { lte: today },
    },
    orderBy: { effectiveFrom: "asc" },
  });

  if (scheduledPayrolls.length === 0) return;

  const payrollToActivate = scheduledPayrolls[0];

  await prisma.$transaction(async (tx) => {
    // Expire current ACTIVE settings
    await tx.payrollSettings.updateMany({
      where: { orgProfileId: org.id, status: "ACTIVE" },
      data: {
        status:      "EXPIRED",
        isLocked:    true,
        effectiveTo: dayjs(payrollToActivate.effectiveFrom)
          .subtract(1, "day")
          .toDate(),
      },
    });

    // Promote SCHEDULED → ACTIVE
    await tx.payrollSettings.update({
      where: { id: payrollToActivate.id },
      data:  { status: "ACTIVE", isLocked: true },
    });
  });

  console.log(`[Cron] ✅ Activated payroll settings for org ${org.orgId}`);
}

// ── Step 2: Run payroll if today is a pay day ─────────────────────────────────
async function runPayrollForOrg(org, systemUserId, now) {

  // Re-fetch AFTER activation so we always see the freshest ACTIVE settings
  const activeSettings = await prisma.payrollSettings.findFirst({
    where: { orgProfileId: org.id, status: "ACTIVE" },
    include: {
      payrollRuns: {
        where:   { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take:    1,
        select:  { createdAt: true },
      },
    },
  });

  if (!activeSettings) {
    console.log(`[Cron] Org ${org.orgId} — no active payroll settings, skipping`);
    return;
  }

  const lastRunDate = activeSettings.payrollRuns?.[0]?.createdAt ?? null;

  if (!isPayDay(activeSettings, now, lastRunDate)) {
    console.log(`[Cron] Org ${org.orgId} — not a pay day (${activeSettings.payrollCycle}), skipping`);
    return;
  }

  const params = buildPayrollParams(activeSettings, now);

  await runPayrollService({
    orgId:          org.orgId,
    userId:         systemUserId,
    now:            now.toDate(),
    orgProfile:     { id: org.id, orgId: org.orgId },
    activeSettings,
    lastRunDate,
    ...params,
  });

  console.log(`[Cron] ✅ Payroll run completed — org ${org.orgId} | ${activeSettings.payrollCycle}`);
}

// ── Process one org — activation first, then payroll run ─────────────────────
async function processOrg(org, systemUserId) {
  const tz  = org.timezone || "Asia/Kolkata";
  const now = dayjs().tz(tz);

  // Only process orgs currently in their midnight window
  if (now.hour() !== 0 || now.minute() > 10) return;

  // Step 1 — activate scheduled settings if due
  await activateScheduledPayroll(org, now);

  // Step 2 — run payroll if today is a pay day
  await runPayrollForOrg(org, systemUserId, now);
}

// ── Main cron ─────────────────────────────────────────────────────────────────
let cronRunning = false;

cron.schedule("*/10 * * * *", async () => {
  if (cronRunning) {
    console.log("[Cron] Skipping tick — previous run still active");
    return;
  }

  cronRunning = true;

  try {
    // Fetch orgs that have ACTIVE or SCHEDULED payroll settings
    const orgs = await prisma.orgProfile.findMany({
      where: {
        payrollSettings: {
          some: { status: { in: ["ACTIVE", "SCHEDULED"] } },
        },
      },
      select: {
        id:       true,
        orgId:    true,
        timezone: true,
      },
    });

    if (orgs.length === 0) {
      console.log("[Cron] No orgs with active or scheduled payroll settings found");
      return;
    }

    // Fetch system admin user once for all orgs
    const systemUser = await prisma.user.findFirst({
      where:  { role: "Admin" },
      select: { id: true },
    });

    if (!systemUser) {
      console.error("[Cron] No Admin user found — cannot run payroll");
      return;
    }

    const limit = pLimit(5);

    await Promise.allSettled(
      orgs.map(org =>
        limit(async () => {
          try {
            await processOrg(org, systemUser.id);
          } catch (err) {
            console.error(`[Cron] ❌ Org ${org.orgId}:`, err.message);
          }
        })
      )
    );

  } catch (err) {
    console.error("[Cron] ❌ Fatal error:", err.message);
  } finally {
    cronRunning = false;
  }
});