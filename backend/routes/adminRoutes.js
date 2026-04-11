import express from 'express';
import { getStats, approveJob, getPendingJobs } from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorizeRoles('admin'), getStats);
router.get('/jobs/pending', protect, authorizeRoles('admin'), getPendingJobs);
router.patch('/jobs/:id/approve', protect, authorizeRoles('admin'), approveJob);

export default router;
