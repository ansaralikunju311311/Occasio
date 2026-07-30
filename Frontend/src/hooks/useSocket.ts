import { useEffect } from 'react';
import { socket } from '../services/socket/socket';
export const useSocket = () => {
  useEffect(() => {


    const token = localStorage.getItem('accessToken');
    if(!token){
        return
    }
    socket.auth={
        token
    };
    socket.connect();

    const handleConnect = () => {
      console.log('Socket connected:', socket.id);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.disconnect();
    };
  }, []);

  return socket;
};