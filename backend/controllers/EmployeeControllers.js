import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export const getEmployees = async (req, res) => {
    const { orgId } = req;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search || '').trim();
    const designation = (req.query.designation || '').trim();

    const skip = (page - 1) * limit;

    const where = { orgId };

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { designation: { contains: search, mode: 'insensitive' } },
        ]
    }
    if (designation) {
        where.designation = designation
    }
    try {
        const [employees, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    designation: true,
                    dateOfJoining: true,
                    active: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.user.count({ where }),
        ]);

        const designations = await prisma.user.findMany({
            where: { orgId },
            distinct: ['designation'],
            select: {
                designation: true,
            },
        });

        return res.status(200).json({
            success: true,
            data: employees,
            pagination: {
                page,
                limit,
                total,
            },
            designations
        });
    } catch (error) {
        console.error("Get Employees list Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const addEmployee = async (req, res) => {
    try {
        const { orgId, userId } = req;
        const {name, email, designation, role, dateOfJoining, active} = req.body;
        if(!name || !email || !designation || !role || !dateOfJoining) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        };
        const isExisting = await prisma.user.findUnique({
            where: {
                email_orgId: {
                    email,
                    orgId,
                },
            },
        });
        if(isExisting) {
            return res.status(409).json({
                success: false,
                message: "Employee already exists with this email",
            });
        }
        let password = await bcrypt.hash("newUser", 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password,
                designation,
                role,
                dateOfJoining,
                active,
                orgId,
                createdBy: userId,
            }
        });
        return res.status(201).json({
            success: true,
            message: "Employee added successfully",
        });
    } catch (error) {
        console.error("add Employee Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateEmployee = async (req, res) => {
  try {
    const { orgId, userId } = req;
    const {
      id,
      name,
      email,
      designation,
      role,
      dateOfJoining,
      active,
      password,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employee id is required",
      });
    }

    // Find employee
    const employee = await prisma.user.findFirst({
      where: { id, orgId },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found in this organization",
      });
    }

    const organization = await prisma.org.findUnique({
      where: { id: orgId },
      select: { email: true, name: true },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

      if (
          employee.role === "Org_Admin" &&
          organization.email === employee.email &&
          role &&
          role !== "Org_Admin"
      ) {
          return res.status(403).json({
              success: false,
              message: "Organization admin role cannot be changed",
          });
      }

    const updatedData = {};

    if (name && name !== employee.name) {
      updatedData.name = name;
    }

    if (designation) updatedData.designation = designation;

    if (role) updatedData.role = role;

    if (dateOfJoining) updatedData.dateOfJoining = dateOfJoining;

    if (active !== undefined) updatedData.active = active;

    if (email && email.toLowerCase() !== employee.email) {
      updatedData.email = email.toLowerCase();
    }

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    let shouldUpdateOrg = false;

    // Check if employee is org owner (same email)
    if (
        email &&
        employee.email.toLowerCase() === organization.email.toLowerCase() &&
        email.toLowerCase() !== organization.email.toLowerCase()
    ) {
        shouldUpdateOrg = true;
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          ...updatedData,
          updatedBy: userId,
        },
      });

      if (shouldUpdateOrg) {
        await tx.org.update({
          where: { id: orgId },
          data: {
            email: updatedData.email,
            name: name || organization.name,
          },
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email already exists in this organization",
      });
    }

    console.error("Update Employee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteEmployee = async (req, res) => {
    try {
        const {orgId, userId} = req;
        
        const {id} = req.params;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Id is required",
            });
        }
        const employeeExists = await prisma.user.findUnique({
            where: {id, orgId},
        });
        if(!employeeExists) {
            return res.status(404).json({
                success: false,
                message: "Employee not found in this organization",
            });
        }
        await prisma.user.delete({
            where: {id, orgId},
        });
        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
        });
        
    } catch (error) {
        console.error("delete Employee Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getEmployeeById = async (req, res) => {

};