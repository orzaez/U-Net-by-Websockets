import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<any>(null);
  const [imageData, setImageData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const socketConnection = io(url);
    setSocket(socketConnection);

    socketConnection.on('file_processed', (data: { image: Uint8Array, error?: string }) => {
      if (data.image) {
        setImageData(data.image);
      } else if (data.error) {
        console.error('Error processing file:', data.error);
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [url]);

  const sendFile = useCallback((filename: string, fileData: ArrayBuffer) => {
    if (socket) {
      socket.emit('upload_file', { filename, file: fileData });
    }
  }, [socket]);

  return { sendFile, imageData };
};

export default useWebSocket;
