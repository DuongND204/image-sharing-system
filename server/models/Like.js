import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    imageId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Đảm bảo mỗi user chỉ like một image một lần
likeSchema.index({ imageId: 1, userId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;
