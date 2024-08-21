
// Propósito: Es un componente específico de la aplicación que se encarga de manejar el proceso de cargar una imagen, 
// enviarla al servidor para que sea procesada por un modelo U-Net, y luego mostrar la imagen procesada en la interfaz de usuario.

// Función Principal: Orquestar el flujo completo de la selección del archivo, el envío del archivo al servidor 
// a través de WebSocket, y la recepción y visualización de la imagen procesada.

// Responsabilidad: UNet coordina la funcionalidad proporcionada por FileUploader (para la selección de archivos) 
// y agrega lógica adicional para enviar el archivo al servidor y mostrar los resultados procesados.

import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import useWebSocket from '../hooks/useWebSocket';
import styles from '../styles/UNet.module.css';

const UNet: React.FC = () => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  // Usar el hook de WebSocket con la IP y puerto correctos
  // imageData = Es un estado que contiene los datos de la imagen procesada recibida desde el servidor.
  const { sendFile, imageData } = useWebSocket('http://IP_BACK:5000');

  // se ejecuta cada vez que cambia el valor de imageData
  useEffect(() => {
    if (imageData) {
      const blob = new Blob([new Uint8Array(imageData)], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    }
  }, [imageData]);

  // Es la función que se encarga de manejar el archivo seleccionado por el usuario y enviarlo al servidor para su procesamiento

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Verifica que la lectura del archivo haya sido exitosa y que el resultado no sea null
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
