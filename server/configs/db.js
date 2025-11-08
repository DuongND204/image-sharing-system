import mongoose from 'mongoose';

export default async function connectDb() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb://localhost:27017/image_sharing_system'
    );
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
}
