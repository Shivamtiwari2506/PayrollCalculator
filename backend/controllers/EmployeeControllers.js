import { PrismaClient } from "@prisma/client";

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
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.user.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            data: employees,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: skip + employees.length < total,
                hasPrev: page > 1,
            },
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

};

export const updateEmployee = async (req, res) => {

};

export const deleteEmployee = async (req, res) => {

};

export const getEmployeeById = async (req, res) => {

};