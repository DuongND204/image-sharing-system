// src/user/UserModal.jsx
import { useState, useEffect } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";

export default function UserModal({ show, onClose, onSave, user }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "user",
    avatar_url: "",
  });

  useEffect(() => {
    if (user) setForm(user);
    else setForm({ username: "", email: "", role: "user", avatar_url: "" });
  }, [user]);

  // Chuyển ảnh sang base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, avatar_url: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{user ? "Edit User" : "Add User"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Avatar</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            {form.avatar_url && (
              <div className="text-center mt-3">
                <Image
                  src={form.avatar_url}
                  roundedCircle
                  width={100}
                  height={100}
                  alt="Avatar preview"
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {user ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
