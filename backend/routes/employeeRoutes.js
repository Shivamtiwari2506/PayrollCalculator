import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { addEmployee, deleteEmployee, getEmployees, updateEmployee } from '../controllers/EmployeeControllers.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getEmployees);
router.post('/', addEmployee);
router.put('/update', updateEmployee);
router.delete('/:id', deleteEmployee);
export default router;