import { UserService } from "../services/UserService.js";

export const UserController = {
  async list(req, res) {
    const result = await UserService.getAllUsers();
    res.json(result);
  },

  async get(req, res) {
    const result = await UserService.getUser(req.params.id);
    res.json(result);
  },

  async create(req, res) {
    try {
      const result = await UserService.createUser(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    const result = await UserService.updateUser(req.params.id, req.body);
    res.json(result);
  },

  async toggleStatus(req, res) {
    const result = await UserService.toggleStatus(req.params.id);
    res.json(result);
  },

  async delete(req, res) {
    await UserService.deleteUser(req.params.id);
    res.json({ message: "Deleted" });
  },
};
