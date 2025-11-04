import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    categoryId: { type: Number },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    isHidden: { type: Boolean, default: false },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export default mongoose.model('Image', imageSchema);


