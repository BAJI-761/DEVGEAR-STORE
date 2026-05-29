import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from './src/models/Product.js';

dotenv.config({ path: path.resolve(process.cwd(), './.env') });

async function clear() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || undefined });
  await Product.deleteMany({});
  console.log('Cleared products');
  await mongoose.disconnect();
}

clear();
