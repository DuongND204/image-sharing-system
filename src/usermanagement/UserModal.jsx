import { Modal, Button, Form } from "react-bootstrap";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { toBase64 } from "../utils/toBase64";

const schema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.string().required(),
});

export default function UserModal({ show, hide, initial, onSubmit }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "user",
    avatarUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const setValue = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      onSubmit(form);
    } catch (err) {
      const errs = {};
      err.inner.forEach((e) => (errs[e.path] = e.message));
      setErrors(errs);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const base64 = await toBase64(file);
    setUploading(false);

    setValue("avatarUrl", base64);
  };

  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? "Edit User" : "Add User"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={form.username}
              isInvalid={!!errors.username}
              onChange={(e) => setValue("username", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={form.email}
              isInvalid={!!errors.email}
              onChange={(e) => setValue("email", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={form.role}
              onChange={(e) => setValue("role", e.target.value)}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Avatar</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleAvatar}
            />

            {uploading && <div className="mt-2">Converting...</div>}

            {form.avatarUrl && (
              <img
                src={form.avatarUrl}
                alt="avatar"
                className="mt-2"
                width={80}
                height={80}
                style={{ borderRadius: "8px" }}
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={hide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
