import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['applied', 'shortlisted', 'interview', 'offer', 'rejected'], 
    default: 'applied' 
  },
  matchScore: { type: Number, default: 0 },
  feedback: { type: String } // optional structured feedback from AI
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);
