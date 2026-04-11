import Job from '../models/Job.js';

// @desc    Get all active jobs (or filtered)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: 'open', isApprovedByAdmin: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current recruiter's jobs
// @route   GET /api/jobs/mine
// @access  Private/Recruiter
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiterId', 'name company');
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Recruiter
export const createJob = async (req, res) => {
  try {
    const { title, company, location, type, salary, skills, cgpaCutoff, branches, description } = req.body;

    // Convert strings to arrays if necessary
    const skillsArray = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;
    const branchesArray = typeof branches === 'string' ? branches.split(',').map(s => s.trim()) : branches;

    const job = new Job({
      recruiterId: req.user._id,
      title,
      company,
      location,
      type,
      salary,
      skills: skillsArray,
      cgpaCutoff,
      branches: branchesArray,
      description
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
