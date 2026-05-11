import { Server } from 'socket.io';
import { registerPollSocketHandlers } from '../sockets/poll.socket.js';
import { registerAnalyticsSocketHandlers } from '../sockets/analytics.socket.js';

let io;

/**
 * Initialise Socket.IO on the HTTP server.
 * Stores the instance so it can be imported elsewhere.
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Register domain-specific handlers
    registerPollSocketHandlers(io, socket);
    registerAnalyticsSocketHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Returns the already-initialised Socket.IO instance.
 * Call this anywhere in the server code after initSocket().
 */
export const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialised!');
  return io;
};
