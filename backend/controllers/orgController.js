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