import { SOCKET_EVENTS } from '../constants/index.js';

// Track active participants per poll room
const roomParticipants = {};

/**
 * Registers poll-related socket event handlers.
 */
export const registerPollSocketHandlers = (io, socket) => {
  // Client joins a poll room
  socket.on(SOCKET_EVENTS.JOIN_POLL, (pollId) => {
    const room = `poll:${pollId}`;
    socket.join(room);

    roomParticipants[pollId] = (roomParticipants[pollId] || 0) + 1;
    io.to(room).emit(SOCKET_EVENTS.PARTICIPANT_COUNT, { pollId, count: roomParticipants[pollId] });

    console.log(`Socket ${socket.id} joined room ${room}. Participants: ${roomParticipants[pollId]}`);
  });

  // Client leaves a poll room
  socket.on(SOCKET_EVENTS.LEAVE_POLL, (pollId) => {
    const room = `poll:${pollId}`;
    socket.leave(room);

    if (roomParticipants[pollId] > 0) roomParticipants[pollId]--;
    io.to(room).emit(SOCKET_EVENTS.PARTICIPANT_COUNT, { pollId, count: roomParticipants[pollId] || 0 });
  });

  // Auto-decrement on disconnect
  socket.on('disconnect', () => {
    // Iterate through all rooms this socket was in
    Object.keys(roomParticipants).forEach((pollId) => {
      if (socket.rooms?.has(`poll:${pollId}`)) {
        if (roomParticipants[pollId] > 0) roomParticipants[pollId]--;
        io.to(`poll:${pollId}`).emit(SOCKET_EVENTS.PARTICIPANT_COUNT, {
          pollId,
          count: roomParticipants[pollId] || 0,
        });
      }
    });
  });
};
