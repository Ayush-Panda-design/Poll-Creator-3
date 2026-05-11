import { createContext, useContext, useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../socket/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      socketRef.current = connectSocket();
    }
    return () => {
      // Don't disconnect globally — let individual components manage rooms
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, getSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
