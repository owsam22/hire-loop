import express from 'express';
import { getStats } from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorizeRoles('admin'), getStats);

export default router;
