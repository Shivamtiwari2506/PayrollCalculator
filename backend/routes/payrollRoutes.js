import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createPayroll, deletePayroll, getPayroll, updatePayroll,
  runPayroll, getPayrollRuns, getPayrollRunById,
  getPayslipMonths, getPayslipByMonth
} from '../controllers/payrollControllers.js';
const router = express.Router();

router.use(authenticateToken);

router.get('/settings', getPayroll);
router.post('/settings', createPayroll);
router.put('/settings/:payrollId', updatePayroll);
router.delete('/settings/:payrollId', deletePayroll);

router.post('/run', runPayroll);
router.get('/run', getPayrollRuns);
router.get('/run/:id', getPayrollRunById);

// Payslip routes (for logged-in employee)
router.get('/payslip/months', getPayslipMonths);
router.get('/payslip/:month', getPayslipByMonth);

export default router;