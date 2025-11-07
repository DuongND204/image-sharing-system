import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import usersRouter from './routes/users.js';
import imagesRouter from './routes/images.js';
import authRouter from './routes/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow base64 image payloads
app.use(morgan('dev'));

// Static uploads
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/images', imagesRouter);
app.use('/api/auth', authRouter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Mongo connection
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/image_sharing_system';
const PORT = process.env.PORT || 4000;

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
