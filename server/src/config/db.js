import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not set. Database connection skipped for now.');
    return;
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}