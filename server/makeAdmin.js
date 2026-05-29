import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const email = process.argv[2];

if (!email) {
  console.error("Please provide the email address to upgrade.");
  console.error("Usage: node makeAdmin.js <email>");
  process.exit(1);
}

async function makeAdmin() {
  try {
    console.log(`Connecting to database...`);
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`Finding user with email: ${email}...`);
    const db = mongoose.connection.db;
    
    const result = await db.collection('users').updateOne(
      { email: email },
      { $set: { role: 'admin' } }
    );
    
    if (result.matchedCount === 0) {
      console.log(`Error: No user found with email ${email}`);
    } else {
      console.log(`Success! Upgraded ${email} to admin.`);
    }
  } catch (error) {
    console.error("Error connecting to database:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();
