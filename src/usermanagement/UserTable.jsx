import { useState } from "react";
import { Table, Button, Badge, Modal } from "react-bootstrap";

export default function UserTable({ users, onEdit, onToggle, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onDelete(selectedId);
    setShowConfirm(false);
  };

  return (
    <>
      <Table bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th width="200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <img
                  src={u.avatarUrl}
                  width="45"
                  height="45"
                  style={{ borderRadius: "8px" }}
                  alt=""
                />
              </td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <Badge bg={u.status === "active" ? "success" : "secondary"}>
                  {u.status}
                </Badge>
              </td>

              <td>
                <Button size="sm" onClick={() => onEdit(u)} variant="primary">
                  Edit
                </Button>{" "}
                <Button size="sm" onClick={() => onToggle(u.id)} variant="warning">
                  Toggle
                </Button>{" "}
                <Button size="sm" onClick={() => confirmDelete(u.id)} variant="danger">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ✅ Confirm Delete Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
