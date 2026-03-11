import express from 'express';
import { createTaxSlab, getTaxSlab, updateTaxSlab } from '../controllers/IncomeTaxSlabControllers.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTaxSlab);

router.use(authenticateToken);

router.post('/', createTaxSlab);
router.put('/', updateTaxSlab);

export default router;