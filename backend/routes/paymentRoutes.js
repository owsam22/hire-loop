import express from 'express';
import { processPayment, getPayments } from '../controllers/paymentController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/process', protect, authorizeRoles('recruiter'), processPayment);
router.get('/', protect, authorizeRoles('admin'), getPayments);

export default router;
