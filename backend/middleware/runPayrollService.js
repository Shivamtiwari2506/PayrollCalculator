
import { ValidationError } from "../utils/errors.js";
import { calculateEmployeePayroll } from "../utils/payrollCalculator.js";

const daysMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
};

export const runPayrollService = async ({
    orgId,
    userId,
    month,
    startDate,
    endDate,
    now,
    orgProfile,
    activeSettings,
    lastRunDate
}) => {
    const payrollCycleType = activeSettings?.payrollCycle;

    const config = typeof activeSettings.cycleConfig === "string"
        ? JSON.parse(activeSettings.cycleConfig)
        : activeSettings.cycleConfig;

    const todayDayNum = now.getDay();
    const todayDateNum = now.getDate();


    if (payrollCycleType === "monthly") {
        if (!month || !/^\d{4}-\d{2}$/.test(month))
            throw new ValidationError("month is required in YYYY-MM format");
    } else {
        if (!startDate || !endDate)
            throw new ValidationError("startDate and endDate are required");
        if (new Date(startDate) > new Date(endDate))
            throw new ValidationError("startDate cannot be after endDate");
    }

    // Prevent duplicate runs for the same month
    let existing;
    if (payrollCycleType === "monthly") {
        existing = await prisma.payrollRun.findFirst({
            where: {
                orgId,
                month
            }
        });
    } else {
        existing = await prisma.payrollRun.findFirst({
            where: {
                orgId,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }
        });
    }

    if (existing) {
        throw new ValidationError(
            payrollCycleType === "monthly"
                ? `Payroll for ${month} has already been run`
                : `Payroll for the selected period has already been run`
        );
    }

    switch (payrollCycleType) {

        case "monthly": {
            const payrollEndDay = Number(config.payrollEndDay);
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const effectiveEndDay = payrollEndDay === 31 ? lastDayOfMonth : payrollEndDay;

            if (todayDateNum !== effectiveEndDay)
                throw new ValidationError(
                    `Monthly payroll can only be run on day ${effectiveEndDay} of the month`
                );
            break;
        }

        case "weekly": {
            const payDayNum = daysMap[config.paymentDate?.toLowerCase()];
            if (payDayNum === undefined)
                throw new ValidationError("Invalid paymentDate in weekly payroll config");
            if (todayDayNum !== payDayNum)
                throw new ValidationError(
                    `Weekly payroll can only be run on ${config.paymentDate}`
                );
            break;
        }

        case "biweekly": {
            const payDayNum = daysMap[config.paymentDate?.toLowerCase()];
            if (payDayNum === undefined)
                throw new ValidationError("Invalid paymentDate in biweekly payroll config");
            if (todayDayNum !== payDayNum)
                throw new ValidationError(
                    `Biweekly payroll can only be run on ${config.paymentDate}`
                );

            if (lastRunDate) {
                const diffInDays = Math.floor((now - new Date(lastRunDate)) / 86_400_000);
                if (diffInDays < 14)
                    throw new ValidationError(
                        `Biweekly payroll can only run after 14 days. ${14 - diffInDays} day(s) remaining`
                    );
            }
            break;
        }

        default:
            throw new ValidationError("Invalid payroll cycle type");
    }

    // Fetch all active employees for this org
    const employees = await prisma.user.findMany({
        where: { orgId, active: true, role: "User" }
    });
    if (employees.length === 0) {
        return res.status(400).json({ success: false, msg: "No active employees found" });
    }

    // Fetch tax config if TDS is enabled (use current financial year)
    let taxConfig = null;
    if (activeSettings.tdsEnabled) {
        const referenceDate =
            payrollCycleType === "monthly"
                ? new Date(`${month}-01`)
                : new Date(startDate);

        const year = referenceDate.getFullYear();
        const monthNum = referenceDate.getMonth() + 1;
        // Indian FY: April (4) to March (3)
        const fyStart = monthNum >= 4 ? year : year - 1;
        const financialYear = `${fyStart}-${String(fyStart + 1).slice(-4)}`;

        const taxSetting = await prisma.incomeTaxSetting.findFirst({
            where: { financialYear, regime: "new" },
            include: { slabs: { orderBy: { minIncome: "asc" } } }
        });
        if (taxSetting) {
            taxConfig = {
                standardDeduction: taxSetting.standardDeduction,
                cessPercentage: taxSetting.cessPercentage,
                slabs: taxSetting.slabs,
            };
        }
    }

    const entries = employees.map(emp => {
        const calc = calculateEmployeePayroll(emp, activeSettings, taxConfig);
        return {
            payrollRunId: run.id,
            userId: emp.id,
            ...calc,
            breakdown: calc.breakdown,
        };
    });

    // Aggregate totals
    const totalGross = entries.reduce((s, e) => s + e.grossSalary, 0);
    const totalDeductions = entries.reduce((s, e) => s + e.totalDeductions, 0);
    const totalNet = entries.reduce((s, e) => s + e.netPay, 0);

    // Run everything in a transaction
    return await prisma.$transaction(async (tx) => {
        // Create the PayrollRun record
        const run = await tx.payrollRun.create({
            data: {
                orgId,
                payrollSettingsId: activeSettings.id,
                month: payrollCycleType === "monthly" ? month : null,
                startDate: payrollCycleType !== "monthly" ? new Date(startDate) : null,
                endDate: payrollCycleType !== "monthly" ? new Date(endDate) : null,
                status: "PROCESSING",
                runBy: userId,
            }
        });

        // Calculate an entry for each employee of the calculated payroll
        await tx.payrollRunEntry.createMany({
            data: entries.map(e => ({ ...e, payrollRunId: run.id })),
        });

        // Mark run as COMPLETED with totals
        return await tx.payrollRun.update({
            where: { id: run.id },
            data: {
                status: "COMPLETED",
                totalEmployees: employees.length,
                totalGross,
                totalDeductions,
                totalNet,
            }
        });
    });
}