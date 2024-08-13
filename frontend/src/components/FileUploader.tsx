import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
// como una pieza reutilizable de la interfaz de usuario. Un componente puede ser tan simple como un botón o tan complejo como toda una página.
interface FileUploaderProps {
    socket: Socket;
    setUploadStatus: (status: string) => void;
}
// FileUploader maneja la carga de archivos.
const FileUploader: React.FC<FileUploaderProps> = ({ socket, setUploadStatus }) => {
        // useState<File | null>(null): El hook useState se inicializa con null y está tipado para aceptar valores de tipo File o null
        const [file, setFile] = useState<File | null>(null);
        const [connectionStatus, setConnectionStatus] = useState<string>('');
        const [originalImage, setOriginalImage] = useState<string | null>(null);
        const [processedImage, setProcessedImage] = useState<string | null>(null);
        const [uploadStatus, setUploadStatusState] = useState<string>('');  // Nueva línea para manejar el estado de la subida

    // useEffect: Este hook se ejecuta después de que el componente se renderiza por primera vez. 
    // La lista vacía [] como segundo argumento significa que se ejecutará solo una vez (cuando el componente se monta).
    // El hook useEffect se utiliza para realizar efectos secundarios en componentes funcionales. Los efectos secundarios son cualquier 
    // tipo de acción que ocurre fuera del flujo de renderizado de React, como suscripciones, temporizadores, 
    // llamadas a API, y en este caso, la configuración de eventos de WebSocket.
    useEffect(() => {

        // Evento que se activa cuando hay un cambio en el estado de la conexión.
        socket.on('connection_status', (data: { status: string }) => {
            setConnectionStatus(data.status);
        });
        // evento que se activa cuando se recibe un estado relacionado con la carga de un archivo.
        socket.on('file_status', (data: { status: string, filename?: string, message?: string }) => {
            setUploadStatus(data.status);
            if (data.filename) {
                console.log(`File received: ${data.filename}`);
            }
            if (data.message) {
                console.error(data.message);
            }
        });

        socket.on('file_processed', (data: { image: Uint8Array, filename: string }) => {
            const blob = new Blob([data.image], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
        });

        return () => {
            socket.off('connection_status');
            socket.off('file_status');
            socket.off('file_processed');
        };
    }, [socket, setUploadStatus]);
    // El useEffect se ejecutará nuevamente si alguna de las dependencias (socket, setUploadStatus) cambia.
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            const originalUrl = URL.createObjectURL(e.target.files[0]);
            setOriginalImage(originalUrl);
        }
    };

    const handleUpload = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    const arrayBuffer = reader.result as ArrayBuffer;
                    const bytes = new Uint8Array(arrayBuffer);
                    socket.emit('upload_file', { file: bytes, filename: file.name });
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div>
            <p>Connection Status: {connectionStatus}</p>
            <input type="file" accept=".jpg" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{uploadStatus}</p>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {originalImage && (
                    <div>
                        <h3>Original Image:</h3>
                        <img src={originalImage} alt="Original" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    </div>
                )}
                {processedImage && (
                    <div>
                        <h3>Processed Image:</h3>
                        <img src={processedImage} alt="Processed" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
