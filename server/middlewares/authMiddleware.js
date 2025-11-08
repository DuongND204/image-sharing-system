import User from '../models/User.js';
import { verifyToken } from '../lib/utils.js';

const protectRoute = async (req, res, next) => {
  const token =
    req.cookies.access_token || req.headers.authorization?.split(' ')[1];

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
};

export default { protectRoute };
