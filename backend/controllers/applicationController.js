import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private/Student
export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already applied
    const existingApp = await Application.findOne({
      jobId: req.params.jobId,
      userId: req.user._id
    });

    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Call AI Match Engine here ideally to calculate matchScore
    // For now, mock a match score based on user skills vs job skills
    const userSkills = req.user.skills || [];
    const jobSkills = job.skills || [];
    let matchCount = 0;
    
    jobSkills.forEach(skill => {
      if (userSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        matchCount++;
      }
    });
    
    // Simple mock math
    const matchScore = jobSkills.length > 0 
      ? Math.round((matchCount / jobSkills.length) * 100) 
      : 80;

    const application = await Application.create({
      jobId: req.params.jobId,
      userId: req.user._id,
      matchScore
    });

    // Update job applicant count
    job.applicants += 1;
    await job.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's applications
// @route   GET /api/applications/mine
// @access  Private/Student
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('jobId')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private/Recruiter
export const getApplicantsForJob = async (req, res) => {
  try {
    // Ensure the recruiter owns this job
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these applicants' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email college branch cgpa skills')
      .sort({ matchScore: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private/Recruiter
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // validate status
    if (!['applied', 'shortlisted', 'interview', 'offer', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('jobId');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.jobId.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    const updatedApplication = await application.save();

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
