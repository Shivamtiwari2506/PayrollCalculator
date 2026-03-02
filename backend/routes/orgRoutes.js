import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createOrg, getCurrentOrg } from '../controllers/orgController.js';

const router = express.Router();

router.post('/create', createOrg);

router.use(authenticateToken);
router.get('/me', getCurrentOrg);

export default router;