import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import FileUploader from './FileUploader';

//WebSocketComponent maneja la lógica de la conexión WebSocket,
const WebSocketComponent: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    useEffect(() => {
        const newSocket: Socket = io('http://10.14.31.212:5000', { transports: ['websocket'] });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        newSocket.on('connect_error', () => {
            console.log('Connection failed');
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <div>
            {socket ? <FileUploader socket={socket} setUploadStatus={setUploadStatus} /> : <p>Connecting...</p>}
            <p>{uploadStatus}</p>
        </div>
    );
};

export default WebSocketComponent;
