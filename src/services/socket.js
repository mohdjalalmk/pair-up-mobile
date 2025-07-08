import io from 'socket.io-client';
import { API_BASE_URL } from '@env';

export const createSocketConnection = () => {
  //for local
//   return io('http://localhost:3000');
  return io(API_BASE_URL, {
    transports: ['websocket'],
    secure: true,
    reconnection: true,
  });
};
