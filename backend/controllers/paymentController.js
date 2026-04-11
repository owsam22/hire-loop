import Payment from '../models/Payment.js';
import Job from '../models/Job.js';

// @desc    Process a mock payment for listing fee
// @route   POST /api/payments/process
// @access  Private/Recruiter
export const processPayment = async (req, res) => {
  try {
    const { jobId, amount, cardLast4, nameOnCard } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this job' });
    }

    // Simulate payment processing delay & logic
    const transactionId = 'txn_' + Math.random().toString(36).substr(2, 9);
    
    // Create new payment record
    const payment = await Payment.create({
      recruiterId: req.user._id,
      jobId,
      amount,
      status: 'pending', // Pending Admin Approval
      transactionId,
      cardLast4
    });

    // Update job payment status to pending
    job.paymentStatus = 'pending';
    await job.save();

    res.status(201).json({ 
      message: 'Payment received. Waiting for Admin approval.', 
      payment 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payments for admin Dashboard
// @route   GET /api/payments
// @access  Private/Admin
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('recruiterId', 'name company email')
      .populate('jobId', 'title status')
      .sort({ createdAt: -1 });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
