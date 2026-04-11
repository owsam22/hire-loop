import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const placed = await Application.countDocuments({ status: 'offer' });

    res.json({
      totalStudents,
      totalCompanies,
      totalJobs,
      placed,
      placementRate: totalStudents > 0 ? Math.round((placed / totalStudents) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a job / payment
// @route   PATCH /api/admin/jobs/:id/approve
// @access  Private/Admin
export const approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    job.isApprovedByAdmin = true;
    job.paymentStatus = 'paid'; // Automatically consider paid if approved
    
    await job.save();
    
    res.json({ message: 'Job approved successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending jobs
// @route   GET /api/admin/jobs/pending
// @access  Private/Admin
export const getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isApprovedByAdmin: false })
      .populate('recruiterId', 'name company email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
