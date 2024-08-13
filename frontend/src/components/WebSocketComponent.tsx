import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface WebSocketComponentProps {
  setConnectionStatus: (status: string) => void;
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({ setConnectionStatus }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket: Socket = io('http://10.14.31.212:5000', { transports: ['websocket'] });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('Conectado');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('Desconectado');
    });

    newSocket.on('connect_error', () => {
      console.log('Connection failed');
      setConnectionStatus('Connection failed');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [setConnectionStatus]);

  return (
    <div>
      {socket ? <p>Socket connected</p> : <p>Connecting...</p>}
    </div>
  );
};

export default WebSocketComponent;
