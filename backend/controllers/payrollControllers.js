import {PrismaClient} from "@prisma/client";
import { runPayrollService } from "../middleware/runPayrollService.js";
import { ValidationError } from "../utils/errors.js";
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
 
//  Trigger a payroll run for a given month (e.g. "2026-04").
//  Only one run allowed per org per month.
export const runPayroll = async (req, res) => {
    try {
        const { orgId, userId } = req;
        const { month, startDate, endDate} = req.body;

        // Get org profile to find active payroll settings
        const orgProfile = await prisma.orgProfile.findUnique({ where: { orgId } });
        if (!orgProfile) {
            return res.status(404).json({ success: false, msg: "Organization profile not found" });
        }

        // Get the currently ACTIVE payroll settings
        const activeSettings = await prisma.payrollSettings.findFirst({
            where: { orgProfileId: orgProfile.id, status: "ACTIVE" },
            include: {
                payrollRuns: {
                    where: { status: "COMPLETED" },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: { createdAt: true },
                }
            }
        });
        if (!activeSettings) {
            return res.status(400).json({ success: false, msg: "No active payroll settings found. Please activate a payroll configuration first." });
        }

        const lastRunDate = activeSettings.payrollRuns?.[0]?.createdAt ?? null;

        const result = await runPayrollService({
            orgId,
            userId,
            month,
            startDate,
            endDate,
            now: new Date(),   // controller uses system time (manual trigger)
            orgProfile,
            activeSettings,
            lastRunDate
        });

        return res.status(201).json({ success: true, msg: "Payroll run completed", data: result });

    } catch (error) {
        console.error("runPayroll Error:", error);
        const status = error instanceof ValidationError ? 400 : 500;
        return res.status(status).json({ success: false, msg: error.message });
    }
};

// List all payroll runs for the org (most recent first).

export const getPayrollRuns = async (req, res) => {
    try {
        const { orgId } = req;

        const runs = await prisma.payrollRun.findMany({
            where: { orgId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                month: true,
                startDate: true,
                endDate: true,
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
        console.error("getPayrollRuns Error:", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Returns list of months for which the logged-in user has a payslip.

export const getPayslipMonths = async (req, res) => {
    try {
        const { userId } = req;
        // const orgProfile = await prisma.orgProfile.findUnique({ where: { orgId } });
        // const activeSettings = await prisma.payrollSettings.findFirst({
        //     where: { orgProfileId: orgProfile.id, status: "ACTIVE" }
        // });

        const entries = await prisma.payrollRunEntry.findMany({
            where: {
                userId,
                payrollRun: { status: "COMPLETED" }
            },
            select: {
                payrollRun: { 
                    select: { 
                        month: true, 
                        startDate: true,
                        endDate: true, 
                        createdAt: true 
                    } }
            },
            orderBy: { createdAt: "desc" }
        });

        const payrollPeriods = entries.map((e) => ({
            id: e.payrollRun.id,
            type: e.payrollRun.month
                ? "monthly"
                : "date-range",

            month: e.payrollRun.month || null,

            startDate: e.payrollRun.startDate || null,

            endDate: e.payrollRun.endDate || null,

            processedOn: e.payrollRun.createdAt,
        }));

        return res.status(200).json({ success: true, data: payrollPeriods });

    } catch (error) {
        console.log("getPayslipMonths Error:", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Returns the logged-in user's payslip entry for the given month (YYYY-MM).
export const getPayslipByMonth = async (req, res) => {

    try {

        const { userId, orgId } = req;

        const {
            month,
            startDate,
            endDate
        } = req.query;

        let whereClause = {
            orgId,
            status: "COMPLETED"
        };

        // Monthly
        if (month) {

            whereClause.month = month;

        }

        // Weekly/Biweekly
        else if (startDate && endDate) {

            whereClause.startDate = new Date(startDate);

            whereClause.endDate = new Date(endDate);

        }

        else {

            return res.status(400).json({
                success: false,
                msg: "Provide either month OR startDate and endDate"
            });
        }

        const run = await prisma.payrollRun.findFirst({
            where: whereClause
        });

        if (!run) {

            return res.status(404).json({
                success: false,
                msg: "No completed payroll found"
            });
        }

        const entry = await prisma.payrollRunEntry.findFirst({
            where: {
                payrollRunId: run.id,
                userId
            }
        });

        if (!entry) {

            return res.status(404).json({
                success: false,
                msg: "Payslip not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {

                type: run.month
                    ? "monthly"
                    : "date-range",

                month: run.month,

                startDate: run.startDate,

                endDate: run.endDate,

                processedOn: run.createdAt,

                ...entry
            }
        });

    } catch (error) {

        console.log("getPayslipByMonth Error:", error);

        return res.status(500).json({
            success: false,
            msg: error.message
        });
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