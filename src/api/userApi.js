import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/admin/users",
});

export const userApi = {
  getAll: () => api.get("/"),
  get: (id) => api.get(`/${id}`),
  create: (data) => api.post("/", data),
  update: (id, data) => api.put(`/${id}`, data),
  toggleStatus: (id) => api.patch(`/${id}/status`),
  delete: (id) => api.delete(`/${id}`),
};
