import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { addEmployee, getEmployees } from '../controllers/EmployeeControllers.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getEmployees);
router.post('/', addEmployee);
export default router;