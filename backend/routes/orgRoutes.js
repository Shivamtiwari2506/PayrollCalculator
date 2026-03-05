import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createOrg, getCurrentOrg, getOrgProfile, updateOrgProfile } from '../controllers/orgController.js';
import { createUploader } from '../config/uploadFile.js';

const router = express.Router();

router.post('/create', createOrg);

router.use(authenticateToken);

const uploadLogo = createUploader({
    folder: "payrollMedia/logos",
    formats: ["jpg", "jpeg", "png"],
    fileSize: 1
});
router.get('/me', getCurrentOrg);
router.get('/profile', getOrgProfile);
router.put('/profile', uploadLogo.single("logo"), updateOrgProfile);

export default router;