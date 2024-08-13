import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import useWebSocket from '../hooks/useWebSocket';
import styles from '../styles/UNet.module.css';

const UNet: React.FC = () => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  // Usar el hook de WebSocket con la IP y puerto correctos
  const { sendFile, imageData } = useWebSocket('http://10.14.31.212:5000');

  // Actualizar la imagen procesada cuando se recibe desde el WebSocket
  useEffect(() => {
    if (imageData) {
      const blob = new Blob([new Uint8Array(imageData)], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    }
  }, [imageData]);

  // Manejar la carga del archivo y enviarlo mediante WebSocket
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        sendFile(file.name, e.target.result as ArrayBuffer);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className={styles.container}>
      <h1>Procesamiento de imagen con U-Net</h1>
      <FileUploader onFileUpload={handleFileUpload} />
      {processedImage && <img src={processedImage} alt="Processed" className={styles.image} />}
    </div>
  );
};

export default UNet;
