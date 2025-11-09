import { UserRepository } from "../repositories/UserRepository.js";
import { UserMapper } from "../mappers/UserMapper.js";
import {
  hashPassword,
  generateResetPasswordToken,
  sendEmail,
} from "../lib/utils.js";

export const UserService = {
  async getAllUsers() {
    const users = await UserRepository.findAll();
    return UserMapper.toDTOList(users);
  },

  async getUser(id) {
    const user = await UserRepository.findById(id);
    return UserMapper.toDTO(user);
  },

  async createUser(dto) {
    const { username, email, role } = dto;

    const exist = await UserRepository.findByEmail(email);
    if (exist) throw new Error("Email already exists");

    const tempPassword = Math.random().toString(36).slice(2, 10);
    const hashed = await hashPassword(tempPassword);

    const newUser = await UserRepository.create({
      username,
      email,
      role,
      password: hashed,
      avatarUrl: `https://api.dicebear.com/9.x/pixel-art-neutral/png?seed=${username}`,
    });

    try {
      await sendEmail({
        to: email,
        subject: "Your Account Information",
        text: `
        <h1>Welcome!</h1>
        <p>Your temporary password is:</p>
        <h3>${tempPassword}</h3>
      `,
      });
    } catch (err) {
      console.log("Email send failed:", err);
    }

    return UserMapper.toDTO(newUser);
  },

  async updateUser(id, dto) {
    const updated = await UserRepository.update(id, dto);
    return UserMapper.toDTO(updated);
  },

  async toggleStatus(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");

    const newStatus = user.status === "active" ? "inactive" : "active";
    user.status = newStatus;

    await user.save();
    return UserMapper.toDTO(user);
  },

  async deleteUser(id) {
    await UserRepository.delete(id);
    return true;
  },
};
