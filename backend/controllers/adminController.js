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
