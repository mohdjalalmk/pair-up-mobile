import io from 'socket.io-client';

export const createSocketConnection = () => {
    //for local
  return io('http://localhost:3000');
};
