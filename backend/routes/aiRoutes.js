import express from 'express';
import { analyzeResume, evaluateInterview } from '../controllers/aiController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/resume', protect, authorizeRoles('student'), analyzeResume);
router.post('/interview', protect, authorizeRoles('student'), evaluateInterview);

export default router;
