import User from "../models/User.js";

export const UserRepository = {
  findAll() {
    return User.find().sort({ createdAt: -1 });
  },

  findById(id) {
    return User.findById(id);
  },

  findByEmail(email) {
    return User.findOne({ email });
  },

  create(data) {
    return User.create(data);
  },

  update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  },

  delete(id) {
    return User.findByIdAndDelete(id);
  },
};
