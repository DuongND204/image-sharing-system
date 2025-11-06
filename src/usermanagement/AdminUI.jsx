// src/user/AdminUI.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { UserController } from "./UserController.js";
import {
  Container,
  Table,
  Button,
  Alert,
  Card,
} from "react-bootstrap";
import UserModal from "./UserModal.jsx";

const controller = new UserController();

export default function AdminUI() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const load = async () => {
    const data = await controller.listUsers();
    setUsers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = async (form) => {
    try {
      setError("");
      if (selectedUser) {
        await controller.editUser(selectedUser.id, form);
      } else {
        await controller.addUser(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await controller.removeUser(id);
        load();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await controller.changeUserStatus(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="text-center mb-4 fs-4 fw-semibold">
            User Management
          </Card.Title>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="primary" onClick={handleAdd}>
              + Add User
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Table bordered hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Avatar</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    <img
                      src={
                        u.avatar_url ||
                        `https://i.pravatar.cc/40?u=${u.email}`
                      }
                      alt="avatar"
                      width="40"
                      height="40"
                      style={{ borderRadius: "50%" }}
                    />
                  </td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td
                    className={
                      u.status === "active"
                        ? "text-success fw-semibold"
                        : "text-secondary fw-semibold"
                    }
                  >
                    {u.status}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleEdit(u)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={
                          u.status === "active"
                            ? "outline-warning"
                            : "outline-success"
                        }
                        size="sm"
                        onClick={() => handleToggle(u.id)}
                      >
                        {u.status === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal thêm/sửa user */}
      <UserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        user={selectedUser}
      />
    </Container>
  );
}