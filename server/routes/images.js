import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Image from '../models/Image.js';

const router = Router();

// Multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'image-sharing-system', 'server', 'uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const upload = multer({ storage });

// Create from JSON body (imageUrl or base64)
router.post('/', async (req, res) => {
  try {
    const image = await Image.create({
      userId: req.body.userId || null,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      categoryId: req.body.categoryId ?? null,
      visibility: req.body.visibility || 'public',
      isHidden: !!req.body.isHidden,
    });
    res.status(201).json(image);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Create via file upload (multipart/form-data)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const relative = `/uploads/${req.file.filename}`;
    const image = await Image.create({
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      imageUrl: relative,
      categoryId: req.body.categoryId ? Number(req.body.categoryId) : null,
      visibility: req.body.visibility || 'public',
      isHidden: req.body.isHidden === 'true'
    });
    res.status(201).json(image);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  const q = {};
  if (req.query.visibility) q.visibility = req.query.visibility;
  const images = await Image.find(q).sort({ createdAt: -1 });
  res.json(images);
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Not found' });
    res.json(image);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const image = await Image.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) return res.status(404).json({ message: 'Not found' });
    res.json(image);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const r = await Image.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;


