import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface UseWebSocketResult {
    socket: Socket | null;
    image: string | null;
    connectionStatus: string;
    uploadStatus: string;
    setImage: (image: string | null) => void;
    setUploadStatus: (status: string) => void;
}

const useWebSocket = (): UseWebSocketResult => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
    const [uploadStatus, setUploadStatus] = useState<string>('');

    useEffect(() => {
        const newSocket = io('http://127.0.0.1:5000/', { transports: ['websocket'] });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setConnectionStatus('Connected');
        });

        newSocket.on('file_processed', (data: { image: Uint8Array }) => {
            const blob = new Blob([new Uint8Array(data.image)], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
            setUploadStatus('Image processed successfully');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setConnectionStatus('Disconnected');
        });

        newSocket.on('connect_error', () => {
            console.log('Connection failed');
            setConnectionStatus('Connection failed');
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return { socket, image, connectionStatus, uploadStatus, setImage, setUploadStatus };
};

export default useWebSocket;
