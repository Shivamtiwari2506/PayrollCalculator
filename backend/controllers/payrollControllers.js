import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export const getPayroll = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("getPayroll Error:", error);
        return res.status(500).json({status: false, msg: error.message});
    }
};

export const createPayroll = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("createPayroll Error:", error);
        return res.status(500).json({status: false, msg: error.message});
    }
};

export const updatePayroll = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("updatePayroll Error:", error);
        return res.status(500).json({status: false, msg: error.message});
    }
};

export const deletePayroll = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("deletePayroll Error:", error);
        return res.status(500).json({status: false, msg: error.message});
    }
};