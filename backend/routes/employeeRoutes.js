import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getEmployees } from '../controllers/EmployeeControllers.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getEmployees);
export default router;