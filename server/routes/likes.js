import express from 'express';
import Like from '../models/Like.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Lấy tất cả likes (dùng để đếm)
router.get('/image/all', async (req, res) => {
  try {
    const likes = await Like.find({});
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all likes', error: error.message });
  }
});

// Lấy số lượng likes của một image
router.get('/image/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const likes = await Like.find({ imageId });
    res.status(200).json({ count: likes.length, likes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching likes', error: error.message });
  }
});

// Kiểm tra user đã like image chưa
router.get('/image/:imageId/user/:userId', async (req, res) => {
  try {
    const { imageId, userId } = req.params;
    const like = await Like.findOne({ imageId, userId });
    res.status(200).json({ liked: !!like });
  } catch (error) {
    res.status(500).json({ message: 'Error checking like status', error: error.message });
  }
});

// Thêm like
router.post('/', protectRoute, async (req, res) => {
  try {
    const { imageId } = req.body;
    const userId = req.user._id;

    if (!imageId) {
      return res.status(400).json({ message: 'ImageId is required' });
    }

    // Kiểm tra xem user đã like image này chưa
    const existingLike = await Like.findOne({ imageId, userId });
    if (existingLike) {
      return res.status(400).json({ message: 'You already liked this image' });
    }

    const like = await Like.create({
      imageId,
      userId,
      userName: req.user.username,
    });

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ message: 'Error creating like', error: error.message });
  }
});

// Xóa like (unlike)
router.delete('/:imageId', protectRoute, async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user._id;

    const like = await Like.findOneAndDelete({ imageId, userId });

    if (!like) {
      return res.status(404).json({ message: 'Like not found' });
    }

    res.status(200).json({ message: 'Like removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing like', error: error.message });
  }
});

export default router;
