import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { userApi } from "../api/userApi";
import UserTable from "./UserTable";
import UserModal from "./UserModal";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const res = await userApi.getAll();
    setUsers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (form) => {
    if (editing) {
      await userApi.update(editing.id, form);
    } else {
      await userApi.create(form);
    }
    setShow(false);
    load();
  };

  return (
    <Container className="mt-4">
      <h3>User Management</h3>
      <Button className="mb-3" onClick={() => { setEditing(null); setShow(true); }}>
        + Add User
      </Button>

      <UserTable
        users={users}
        onEdit={(u) => { setEditing(u); setShow(true); }}
        onToggle={async (id) => { await userApi.toggleStatus(id); load(); }}
        onDelete={async (id) => { await userApi.delete(id); load(); }}
      />

      <UserModal
        show={show}
        hide={() => setShow(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
