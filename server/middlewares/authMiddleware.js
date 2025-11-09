import User from '../models/User.js';
import { verifyToken } from '../lib/utils.js';

export const protectRoute = async (req, res, next) => {
  try {
    // Lấy token từ Authorization header hoặc cookies
    const token =
      req.headers.authorization?.split(' ')[1] || req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};
