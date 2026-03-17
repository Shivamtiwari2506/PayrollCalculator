import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createPayroll, deletePayroll, getPayroll, updatePayroll } from '../controllers/payrollControllers.js';
const router = express.Router();

router.use(authenticateToken);

router.get('/settings', getPayroll);
router.post('/settings', createPayroll);
router.put('/settings/:payrollId', updatePayroll);
router.delete('/settings/:payrollId', deletePayroll);

export default router;