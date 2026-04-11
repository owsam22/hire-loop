import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  logo: { type: String, default: '🚀' },
  logoColor: { type: String, default: '#6366f1' },
  location: { type: String, required: true },
  type: { type: String, default: 'Full-time' },
  salary: { type: String },
  skills: [{ type: String }],
  cgpaCutoff: { type: Number, default: 0 },
  branches: [{ type: String }],
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  isApprovedByAdmin: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
