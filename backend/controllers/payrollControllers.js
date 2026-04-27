import {PrismaClient} from "@prisma/client";
import { calculateEmployeePayroll } from "../utils/payrollCalculator.js";
const prisma = new PrismaClient();

export const getPayroll = async (req, res) => {
    try {
        const { orgId, role } = req;
        console.log(role);

        if (!orgId) {
            return res.status(400).json({ success: false, msg: "Unauthorized" });
        }
        if(role !== "Admin" && role !== "Org_Admin") {
            return res.status(400).json({ success: false, msg: "Unauthorized role" });
        }

        const orgProfile = await prisma.orgProfile.findUnique({
            where: { orgId }
        });

        if (!orgProfile) {
            return res.status(404).json({ success: false, msg: "Organization profile not found" });
        }

        const settings = await prisma.payrollSettings.findMany({
            where: { orgProfileId: orgProfile.id },
            orderBy: { version: "desc" }
        });

        return res.status(200).json({ success: true, data: settings });

    } catch (error) {
        console.log("getPayroll Error:", error);
        return res.status(500).json({success: false, msg: error.message});
    }
};

export const createPayroll = async (req, res) => {
    try {
        const { orgId, userId } = req;
        console.log("orgId, userId", orgId, userId);
        const settings = req.body;

        if (!orgId || !userId) {
            return res.status(400).json({ success: false, msg: "Unauthorized" });
        }

        const orgProfile = await prisma.orgProfile.findUnique({
            where: { orgId: orgId }
        });

        if (!orgProfile) {
            return res.status(404).json({ success: false, msg: "Organization profile not found" });
        }

        
        if (!settings.effectiveFrom) {
            return res.status(400).json({ success: false, msg: "effectiveFrom is required" });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const effectiveFrom = new Date(settings.effectiveFrom);
        effectiveFrom.setHours(0, 0, 0, 0);

        //No backdated payroll
        if (effectiveFrom <= today) {
            return res.status(400).json({
                success: false,
                msg: "Payroll must be created for a future date only"
            });
        }

        // Percentage validation
        const totalPercent =
            settings.basicPercent +
            settings.hraPercent +
            settings.allowancePercent;

        if (Math.round(totalPercent) !== 100) {
            return res.status(400).json({
                success: false,
                msg: "Salary structure must be 100%"
            });
        }

        const startOfMonth = new Date(effectiveFrom.getFullYear(), effectiveFrom.getMonth(), 1);
        const endOfMonth = new Date(effectiveFrom.getFullYear(), effectiveFrom.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const result = await prisma.$transaction(async (tx) => {

            const existingFuture = await tx.payrollSettings.findFirst({
                where: {
                    orgProfileId: orgProfile.id,
                    effectiveFrom: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    },
                }
            });

            console.log("existingFuture", existingFuture, effectiveFrom);

            if (existingFuture) {
                console.log("existingFuture,,,,,,,", existingFuture.effectiveFrom === effectiveFrom);
                if(existingFuture.effectiveFrom.toDateString() === effectiveFrom.toDateString()) {
                    throw new Error("Payroll already exists for this date");
                }
                if (existingFuture.isLocked) {
                    throw new Error("Cannot update locked payroll");
                }



                return await tx.payrollSettings.update({
                    where: { id: existingFuture.id },
                    data: {
                        ...settings,
                        effectiveFrom,
                        updatedBy: userId
                    }
                });
            }

            const latest = await tx.payrollSettings.findFirst({
                where: { orgProfileId: orgProfile.id },
                orderBy: { version: "desc" }
            });

            const nextVersion = latest ? latest.version + 1 : 1;

            const payroll = await tx.payrollSettings.create({
                data: {
                    ...settings,
                    orgProfileId: orgProfile.id,
                    version: nextVersion,
                    status: "SCHEDULED",
                    isLocked: false,
                    createdBy: userId,
                    updatedBy: userId,
                    effectiveFrom,
                    effectiveTo: null
                }
            });

            return payroll;
        });

        return res.status(201).json({
            success: true,
            message: "Payroll scheduled successfully",
            data: result
        });

    } catch (error) {
        console.log("createPayroll Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updatePayroll = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("updatePayroll Error:", error);
        return res.status(500).json({success: false, msg: error.message});
    }
};

export const deletePayroll = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("deletePayroll Error:", error);
        return res.status(500).json({success: false, msg: error.message});
    }
};

// ─── Payroll Run ────────────────────────────────────────────────────────────

/**
 * POST /api/payroll/run
 * Trigger a payroll run for a given month (e.g. "2026-04").
 * Only one run allowed per org per month.
 */
export const runPayroll = async (req, res) => {
    try {
        const { orgId, userId } = req;
        const { month } = req.body; // expected format: "YYYY-MM"

        if (!month || !/^\d{4}-\d{2}$/.test(month)) {
            return res.status(400).json({ success: false, msg: "month is required in YYYY-MM format" });
        }

        // Get org profile to find active payroll settings
        const orgProfile = await prisma.orgProfile.findUnique({ where: { orgId } });
        if (!orgProfile) {
            return res.status(404).json({ success: false, msg: "Organization profile not found" });
        }

        // Get the currently ACTIVE payroll settings
        const activeSettings = await prisma.payrollSettings.findFirst({
            where: { orgProfileId: orgProfile.id, status: "ACTIVE" }
        });
        if (!activeSettings) {
            return res.status(400).json({ success: false, msg: "No active payroll settings found. Please activate a payroll configuration first." });
        }

        // Prevent duplicate runs for the same month
        const existing = await prisma.payrollRun.findFirst({
            where: { orgId, month }
        });
        if (existing) {
            return res.status(400).json({ success: false, msg: `Payroll for ${month} has already been run (status: ${existing.status})` });
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
            const year = parseInt(month.split("-")[0]);
            const monthNum = parseInt(month.split("-")[1]);
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

        // Run everything in a transaction
        const payrollRun = await prisma.$transaction(async (tx) => {
            // Create the PayrollRun record
            const run = await tx.payrollRun.create({
                data: {
                    orgId,
                    payrollSettingsId: activeSettings.id,
                    month,
                    status: "PROCESSING",
                    runBy: userId,
                }
            });

            // Calculate and create an entry for each employee
            const entries = employees.map(emp => {
                const calc = calculateEmployeePayroll(emp, activeSettings, taxConfig);
                return {
                    payrollRunId: run.id,
                    userId: emp.id,
                    ...calc,
                    breakdown: calc.breakdown,
                };
            });

            await tx.payrollRunEntry.createMany({ data: entries });

            // Aggregate totals
            const totalGross = entries.reduce((s, e) => s + e.grossSalary, 0);
            const totalDeductions = entries.reduce((s, e) => s + e.totalDeductions, 0);
            const totalNet = entries.reduce((s, e) => s + e.netPay, 0);

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

        return res.status(201).json({ success: true, msg: "Payroll run completed", data: payrollRun });

    } catch (error) {
        console.log("runPayroll Error:", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
};

/**
 * GET /api/payroll/run
 * List all payroll runs for the org (most recent first).
 */
export const getPayrollRuns = async (req, res) => {
    try {
        const { orgId } = req;

        const runs = await prisma.payrollRun.findMany({
            where: { orgId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                month: true,
                status: true,
                totalEmployees: true,
                totalGross: true,
                totalDeductions: true,
                totalNet: true,
                runBy: true,
                createdAt: true,
            }
        });

        return res.status(200).json({ success: true, data: runs });

    } catch (error) {
        console.log("getPayrollRuns Error:", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
};

/**
 * GET /api/payroll/payslip/months
 * Returns list of months for which the logged-in user has a payslip.
 */
export const getPayslipMonths = async (req, res) => {
    try {
        const { userId } = req;

        const entries = await prisma.payrollRunEntry.findMany({
            where: {
                userId,
                payrollRun: { status: "COMPLETED" }
            },
            select: {
                payrollRun: { select: { month: true, createdAt: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        const months = entries.map(e => ({
            month: e.payrollRun.month,
            processedOn: e.payrollRun.createdAt,
        }));

        return res.status(200).json({ success: true, data: months });

    } catch (error) {
        console.log("getPayslipMonths Error:", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
};

/**
 * GET /api/payroll/payslip/:month
 * Returns the logged-in user's payslip entry for the given month (YYYY-MM).
 */
export const getPayslipByMonth = async (req, res) => {
    try {
        const { userId, orgId } = req;
        const { month } = req.params;

        const run = await prisma.payrollRun.findFirst({
            where: { orgId, month, status: "COMPLETED" }
        });

        if (!run) {
            return res.status(404).json({ success: false, msg: `No completed payroll found for ${month}` });
        }

        const entry = await prisma.payrollRunEntry.findFirst({
            where: { payrollRunId: run.id, userId }
        });

        if (!entry) {
            return res.status(404).json({ success: false, msg: "Payslip not found for this month" });
        }

        return res.status(200).json({
            success: true,
            data: {
                month: run.month,
                processedOn: run.createdAt,
                ...entry,
            }
        });

    } catch (error) {
        console.log("getPayslipByMonth Error:", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
};
export const getPayrollRunById = async (req, res) => {
    try {
        const { orgId } = req;
        const { id } = req.params;

        const run = await prisma.payrollRun.findFirst({
            where: { id, orgId },
            include: {
                entries: {
                    select: {
                        id: true,
                        userId: true,
                        employeeName: true,
                        designation: true,
                        ctc: true,
                        grossSalary: true,
                        basic: true,
                        hra: true,
                        allowance: true,
                        pfEmployee: true,
                        pfEmployer: true,
                        esiEmployee: true,
                        esiEmployer: true,
                        professionalTax: true,
                        tds: true,
                        loanDeduction: true,
                        advanceDeduction: true,
                        totalDeductions: true,
                        overtimeAmount: true,
                        bonusAmount: true,
                        netPay: true,
                        breakdown: true,
                    },
                    orderBy: { employeeName: "asc" }
                }
            }
        });

        if (!run) {
            return res.status(404).json({ success: false, msg: "Payroll run not found" });
        }

        return res.status(200).json({ success: true, data: run });

    } catch (error) {
        console.log("getPayrollRunById Error:", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
};