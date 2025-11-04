import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// Create
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Read all
router.get('/', async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const r = await User.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;


