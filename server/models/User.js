import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    role: { type: String, enum: ['admin', 'moderator', 'user'], default: 'user' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export default mongoose.model('User', userSchema);


