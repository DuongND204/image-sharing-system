import User from '../models/User.js';
import {
  generateToken,
  hashPassword,
  comparePassword,
  generateResetPasswordToken,
  sendEmail,
} from '../lib/utils.js';

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ message: 'Invalid password' });
    return;
  }
  const token = generateToken(user._id);
  res.status(200).json({ message: 'Login successful', user, token });
};

const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }
  if (password !== confirmPassword) {
    res.status(400).json({ message: 'Passwords do not match' });
    return;
  }
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    avatarUrl: `https://api.dicebear.com/9.x/pixel-art-neutral/png?seed=${username}`,
  });
  const token = generateToken(user._id);
  res.status(201).json({ message: 'Register successful', user, token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: 'Email không tồn tại' });
    return;
  }
  const resetPasswordToken = generateResetPasswordToken();
  const resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpires = resetPasswordExpires;

  await user.save();

  const resetUrl = `${
    process.env.CLIENT_URL
  }/reset-password?token=${resetPasswordToken}&email=${encodeURIComponent(
    user.email
  )}`;
  console.log('🚀 ~ forgotPassword ~ resetUrl:', resetUrl);
  console.log('🚀 ~ forgotPassword ~ resetUrl:', resetUrl);
  const message = `
          <h1>Password Reset Request</h1>
          <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
          <p>Please click on the link below to reset your password:</p>
          <a href="${resetUrl}" target="_blank">Reset Password</a>
        `;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Token',
      text: message,
    });

    res.status(200).json({
      message: 'Password reset email sent',
    });
  } catch (err) {
    console.log('🚀 ~ forgotPassword ~ err:', err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500).json({
      message: 'Password reset email could not be sent',
    });
  }
};

const resetPassword = async (req, res) => {
  const token = req.query.token;
  const email = req.query.email;
  const { password, confirmPassword } = req.body;

  if (!token || !email) {
    res.status(400).json({ message: 'Token and email are required' });
    return;
  }

  if (!password || !confirmPassword) {
    res
      .status(400)
      .json({ message: 'Password and confirm password are required' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: 'Passwords do not match' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
    email: email,
  });

  if (!user) {
    res.status(400).json({ message: 'Invalid or expired token' });
    return;
  }

  user.password = await hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({
    message: 'Password reset successfully',
  });
};

export default {
  login,
  register,
  forgotPassword,
  resetPassword,
};
