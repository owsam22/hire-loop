import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars with absolute path to ensure they are found
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("WARNING: MONGO_URI is missing! Defaulting to local MongoDB. In production this should be set.");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hireloop');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('HireLoop API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
