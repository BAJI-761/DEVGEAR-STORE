import app from './app.js';
import { connectDatabase } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import { loadEnv } from './config/env.js';

loadEnv();
configureCloudinary();

const port = process.env.PORT || 5000;

async function bootstrap() {
  await connectDatabase();
  const server = app.listen(port, () => {
    console.log(`DevGear Store API listening on port ${port}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('Gracefully shutting down server...');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});