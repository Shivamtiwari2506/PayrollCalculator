import {PrismaClient} from "@prisma/client";
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