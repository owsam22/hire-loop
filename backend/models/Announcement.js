import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tag: { type: String, enum: ['info', 'urgent', 'event'], default: 'info' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Admin who made it
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
