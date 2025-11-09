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
import connectDb from './configs/db.js';
import adminManagerRouter from './routes/userRoutes.js';
const PORT = process.env.PORT || 4000;

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
app.use('/api/admin/users', adminManagerRouter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
