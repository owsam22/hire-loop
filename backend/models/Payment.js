import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  transactionId: { type: String },
  cardLast4: { type: String }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
