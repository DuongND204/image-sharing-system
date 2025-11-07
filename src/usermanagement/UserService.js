import { UserRepository } from "./UserRepository.js";

export class UserService {
  constructor() {
    this.repo = new UserRepository();
  }

  async getAllUsers() {
    return await this.repo.findAll();
  }

  async getUserById(id) {
    return await this.repo.findById(id);
  }

  async createUser(data) {
    const newUser = {
      ...data,
      status: data.status || "active",
      createdAt: new Date().toISOString()
    };
    return await this.repo.createUser(newUser);
  }

  async updateUser(id, data) {
    return await this.repo.updateUser(id, data);
  }

  async deleteUser(id) {
    return await this.repo.deleteUser(id);
  }

  async toggleStatus(id) {
    const user = await this.repo.findById(id);
    const newStatus = user.status === "active" ? "inactive" : "active";
    return await this.repo.updateUser(id, { status: newStatus });
  }
}
