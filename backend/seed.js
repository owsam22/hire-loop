import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';
import Application from './models/Application.js';
import Announcement from './models/Announcement.js';

dotenv.config();

const usersData = [
  {
    name: 'Arjun Mehta',
    email: 'arjun@student.edu',
    password: 'password123',
    role: 'student',
    branch: 'Computer Science',
    cgpa: 8.7,
    year: 3,
    college: 'IIT Bombay',
    skills: ['React', 'Node.js', 'Python', 'SQL', 'Git'],
    resumeScore: 72,
    bio: 'Passionate full-stack developer with a knack for building scalable web apps.',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@google.com',
    password: 'password123',
    role: 'recruiter',
    company: 'Google',
    designation: 'Technical Recruiter',
  },
  {
    name: 'Dr. Rajesh Kumar',
    email: 'admin@placement.edu',
    password: 'password123',
    role: 'admin',
    designation: 'Placement Cell Head',
    college: 'IIT Bombay',
  }
];

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hireloop');
      console.log('MongoDB Connected');
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };

const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await Announcement.deleteMany();

    const createdUsers = await User.insertMany(usersData);
    const recruiter = createdUsers.find(u => u.role === 'recruiter');
    const student = createdUsers.find(u => u.role === 'student');

    const jobsData = [
        {
          title: 'Software Development Engineer',
          company: 'Google',
          logo: 'G',
          logoColor: '#4285F4',
          location: 'Bangalore',
          type: 'Full-time',
          salary: '24 LPA',
          skills: ['React', 'Node.js', 'Python', 'System Design'],
          cgpaCutoff: 7.5,
          branches: ['CS', 'IT', 'ECE'],
          description: 'Join Google\'s engineering team...',
          recruiterId: recruiter._id,
          applicants: 134,
        },
        {
            title: 'Frontend Engineer',
            company: 'Razorpay',
            logo: 'R',
            logoColor: '#072654',
            location: 'Remote',
            type: 'Full-time',
            salary: '18 LPA',
            skills: ['React', 'TypeScript', 'CSS', 'Performance Optimization'],
            cgpaCutoff: 7.0,
            branches: ['CS', 'IT'],
            description: 'Build the next generation of Razorpay...',
            recruiterId: recruiter._id,
            applicants: 67,
          }
      ];

    const createdJobs = await Job.insertMany(jobsData);
    
    // Seed some mock applications
    await Application.create([
        {
            jobId: createdJobs[0]._id,
            userId: student._id,
            status: 'shortlisted',
            matchScore: 87
        },
        {
            jobId: createdJobs[1]._id,
            userId: student._id,
            status: 'applied',
            matchScore: 91
        }
    ]);

    await Announcement.create([
      {
        title: 'Google On-Campus Drive — 15 Jan 2024',
        body: 'Google will be conducting their campus recruitment on January 15th.',
        tag: 'urgent',
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
