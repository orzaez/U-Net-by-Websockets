import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// El contexto de WebSocket tiene como objetivo crear y mantener 
// una única instancia de la conexión WebSocket que pueda ser compartida entre varios componentes en toda la aplicación. Esto asegura que todos los componentes que 
// necesitan acceder al WebSocket lo hagan a través de la misma conexión, evitando múltiples conexiones innecesarias.
interface WebSocketContextProps {
  socket: Socket | null;
}
// Al usar createContext y useContext, el contexto de WebSocket se establece en la raíz de la aplicación (dentro del WebSocketProvider) y luego se puede consumir en cualquier componente hijo.
const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketConnection = io('http://IP_BACK:5000', { transports: ['websocket'], reconnectionAttempts: 5 });
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Connection Error:', error);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // El propósito del componente WebSocketProvider es envolver toda la aplicación o parte de ella, y proporcionar la conexión WebSocket a cualquier componente que lo
  //  necesite a través del Contexto de React. Esto se logra usando WebSocketContext.Provider.
  // Este componente es responsable de "proveer" el valor del contexto (value) a todos los componentes hijos que estén dentro de él en la jerarquía de componentes.
  return (
    // Esto significa que todo el árbol de componentes dentro de <App /> tendrá acceso al contexto de WebSocket.
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
