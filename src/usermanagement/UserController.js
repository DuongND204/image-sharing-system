import { UserService } from "./UserService.js";

export class UserController {
  constructor() {
    this.service = new UserService();
  }

  async listUsers() {
    return await this.service.getAllUsers();
  }

  async viewUser(id) {
    return await this.service.getUserById(id);
  }

  async addUser(data) {
    return await this.service.createUser(data);
  }

  async editUser(id, data) {
    return await this.service.updateUser(id, data);
  }

  async removeUser(id) {
    return await this.service.deleteUser(id);
  }

  async changeUserStatus(id) {
    return await this.service.toggleStatus(id);
  }
}
