import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTaxSlab = async (req, res) => {
    try {
        const { role } = req;
        if (role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create tax slabs"
            });
        }

        const { financialYear, regime, slabs, standardDeduction, cessPercentage } = req.body;

        if (
            !financialYear ||
            !regime ||
            !Array.isArray(slabs) ||
            standardDeduction === undefined ||
            cessPercentage === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existing = await prisma.incomeTaxSetting.findUnique({
            where: {
                financialYear_regime: {
                    financialYear,
                    regime
                }
            }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: `Tax slab already exists for ${financialYear} (${regime} regime)`
            });
        }

        const setting = await prisma.incomeTaxSetting.create({
            data: {
                financialYear,
                regime,
                standardDeduction,
                cessPercentage,
                slabs: {
                    create: slabs
                }
            },
            include: {
                slabs: true
            }
        });

        return res.json({
            success: true,
            message: "Tax slab created successfully",
        });

    } catch (error) {
        console.log("error while creating tax slab", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateTaxSlab = async (req, res) => {
    try {

        const {role} = req;

        if (role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update tax slabs"
            });
        }

        const { financialYear, regime, slabs, standardDeduction, cessPercentage } = req.body;

        if (
            !financialYear ||
            !regime ||
            !Array.isArray(slabs) ||
            standardDeduction === undefined ||
            cessPercentage === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existing = await prisma.incomeTaxSetting.findUnique({
            where: {
                financialYear_regime: {
                    financialYear,
                    regime
                }
            }
        });

        if (!existing) {
            return res.status(400).json({
                success: false,
                message: `Tax slab does not exist for ${financialYear} (${regime} regime)`
            });
        }

        const updated = await prisma.incomeTaxSetting.update({
            where: {
                financialYear_regime: {
                    financialYear,
                    regime
                }
            },
            data: {
                standardDeduction,
                cessPercentage,
                slabs: {
                    deleteMany: {},
                    create: slabs
                }
            },
            include: {
                slabs: true
            }
        });

        return res.json({
            success: true,
            message: "Tax slab updated successfully",
            data: updated
        });

    } catch (error) {
        console.log("error while updating tax slab", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getTaxSlab = async (req, res) => {
  try {

    const { financialYear, regime } = req.query;

    if (!financialYear || !regime) {
      return res.status(400).json({
        success: false,
        message: "financialYear and regime are required"
      });
    }

    const setting = await prisma.incomeTaxSetting.findUnique({
      where: {
        financialYear_regime: {
          financialYear,
          regime
        }
      },
    include: {
        slabs: {
            orderBy: {
             minIncome: "asc"
            }
        }
    }
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: `Tax slab does not exist for ${financialYear} (${regime} regime)`
      });
    }

    return res.json({
      success: true,
      message: "Tax slab fetched successfully",
      data: setting
    });

  } catch (error) {
    console.log("error while fetching tax slab", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};