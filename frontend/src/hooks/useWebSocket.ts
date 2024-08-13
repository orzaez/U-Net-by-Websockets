// Este hook encapsula la lógica para manejar una conexión WebSocket,
//  permitiendo que los componentes envíen archivos y reciban datos procesados sin tener que lidiar con los detalles de la conexión WebSocket.
import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';


const useWebSocket = (url: string) => {
  // Almacena la conexión WebSocket. Inicialmente es null, lo que indica que aún no se ha establecido la conexión.
  const [socket, setSocket] = useState<any>(null);
  const [imageData, setImageData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    // Establecimiento de la Conexión
    const socketConnection = io(url);
    setSocket(socketConnection);
    //Se suscribe al evento file_processed emitido por el servidor, que contiene los datos de la imagen procesada.
    socketConnection.on('file_processed', (data: { image: Uint8Array, error?: string }) => {
      if (data.image) {
        //  Si se recibe una imagen, se actualiza el estado imageData con los datos recibidos.
        setImageData(data.image);
      } else if (data.error) {
        console.error('Error processing file:', data.error);
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [url]);

//Se utiliza para memorizar la función sendFile, de modo que no se recree en cada renderizado, a menos que cambie la dependencia socket
  const sendFile = useCallback((filename: string, fileData: ArrayBuffer) => {
    if (socket) {
      socket.emit('upload_file', { filename, file: fileData });
    }
  }, [socket]);
// sendFile: Es la función que permite enviar archivos al servidor.
// imageData: Es el estado que contiene los datos de la imagen procesada recibidos desde el servidor. 
// Este dato puede ser utilizado por el componente para mostrar la imagen procesada.
  return { sendFile, imageData };
};

export default useWebSocket;
