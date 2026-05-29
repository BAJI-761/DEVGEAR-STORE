import app from './app.js';
import { connectDatabase } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import { loadEnv } from './config/env.js';

loadEnv();
configureCloudinary();

const port = process.env.PORT || 5000;

async function bootstrap() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`DevGear Store API listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});