import express from 'express';
import { 
  applyForJob, 
  getMyApplications, 
  getApplicantsForJob, 
  updateApplicationStatus 
} from '../controllers/applicationController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/:jobId', protect, authorizeRoles('student'), applyForJob);
router.get('/mine', protect, authorizeRoles('student'), getMyApplications);
router.get('/job/:jobId', protect, authorizeRoles('recruiter', 'admin'), getApplicantsForJob);
router.patch('/:id/status', protect, authorizeRoles('recruiter', 'admin'), updateApplicationStatus);

export default router;
