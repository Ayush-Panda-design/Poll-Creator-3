import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './config/socket.js';
import startExpiryJob from './jobs/expiry.job.js';

const PORT = process.env.PORT || 5002;

const start = async () => {
  // Connect to MongoDB
  await connectDB();

  // Create HTTP server from Express app
  const httpServer = http.createServer(app);

  // Initialise Socket.IO
  initSocket(httpServer);

  // Start cron job for poll expiry
  startExpiryJob();

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
