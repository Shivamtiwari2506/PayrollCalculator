import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getCurrentOrg = async (req, res) => {
  try {
    const { orgId } = req;

    if (!orgId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const org = await prisma.org.findUnique({
      where: { id: orgId },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {logo: true},
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: org,
    });
  } catch (error) {
    console.error("Get Org Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const createOrg = async (req, res) => {
  const { orgEmail, password, orgName } = req.body;

  try {
    if (!orgEmail || !password || !orgName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingOrg = await prisma.org.findUnique({
      where: { email: orgEmail },
    });

    if (existingOrg) {
      return res.status(409).json({
        success: false,
        message: "Organization already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {

      const org = await tx.org.create({
        data: {
          name: orgName,
          email: orgEmail,
          profile: {
            create: {}
          }
        },
      });

      const user = await tx.user.create({
        data: {
          email: orgEmail,
          password: hashedPassword,
          name: orgName,
          role: "Org_Admin",
          orgId: org.id,
        },
      });

      return { org, user };
    });

    const token = jwt.sign(
      {
        userId: result.user.id,
        orgId: result.org.id,
        role: result.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: token,
    });
  } catch (error) {
    console.error("Create Org Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getOrgProfile = async (req, res) => {
  try {
    const { orgId } = req;

    if (!orgId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const profile = await prisma.orgProfile.findUnique({
      where: { orgId },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Organization profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get Org Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateOrgProfile = async (req, res) => {
  try {
    const { orgId, role } = req;
    const {
      phone,
      website,
      description,
      industry,
      companySize,
      foundedYear,
      registrationNumber,
      address,
      city,
      state,
      pincode,
      country,
      pan,
      gst,
      taxId,
      bankName,
      accountNumber,
      ifscCode,
      currency,
      timezone,
      fiscalYearStart,
      payrollStartDate,
      workingDays,
    } = req.body;

    let logoUrl = null;

    if (req.file) {
      logoUrl = req.file.path; // Cloudinary URL
    }
    console.log(logoUrl)


    if (!orgId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    // Check authorization - only Org_Admin can update profile
    if (role !== "Org_Admin") {
      return res.status(403).json({
        success: false,
        message: "Only organization admins can update the profile",
      });
    }

    // Validate payrollStartDate if provided
    if (payrollStartDate && (payrollStartDate < 1 || payrollStartDate > 31)) {
      return res.status(400).json({
        success: false,
        message: "Payroll start date must be between 1 and 31",
      });
    }

    // Prepare data for upsert
    const profileData = {
      phone: phone || null,
      website: website || null,
      description: description || null,
      industry: industry || null,
      companySize: companySize || null,
      foundedYear: foundedYear || null,
      registrationNumber: registrationNumber || null,
      address: address || null,
      city: city || null,
      state: state || null,
      pincode: pincode || null,
      country: country || "India",
      pan: pan || null,
      gst: gst || null,
      taxId: taxId || null,
      bankName: bankName || null,
      accountNumber: accountNumber || null,
      ifscCode: ifscCode || null,
      currency: currency || "INR",
      timezone: timezone || "Asia/Kolkata",
      fiscalYearStart: fiscalYearStart || "April",
      payrollStartDate: payrollStartDate ? parseInt(payrollStartDate) : 1,
      workingDays: workingDays || "Monday to Friday",
    };

    if (logoUrl) {
      profileData.logo = logoUrl;
    }

    const profile = await prisma.orgProfile.upsert({
      where: { orgId },
      update: profileData,
      create: {
        ...profileData,
        orgId,
      },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Organization profile updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Update Org Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};