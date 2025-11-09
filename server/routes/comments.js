import express from 'express';
import Comment from '../models/Comment.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Lấy tất cả comments (dùng để đếm)
router.get('/image/all', async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all comments', error: error.message });
  }
});

// Lấy tất cả comments của một image
router.get('/image/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const comments = await Comment.find({ imageId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
});

// Tạo comment mới
router.post('/', protectRoute, async (req, res) => {
  try {
    const { imageId, text } = req.body;
    const userId = req.user._id;

    if (!imageId || !text) {
      return res.status(400).json({ message: 'ImageId and text are required' });
    }

    const comment = await Comment.create({
      imageId,
      userId,
      text,
      userName: req.user.username,
      userAvatar: req.user.avatarUrl,
    });

    const populatedComment = await comment.populate('userId', 'username email');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
});

// Xóa comment
router.delete('/:commentId', protectRoute, async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Kiểm tra xem người dùng có phải là chủ của comment không
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.deleteOne({ _id: commentId });
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
});

export default router;
