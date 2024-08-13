// Propósito: Es un componente de utilidad genérica que permite al usuario seleccionar y subir un archivo. 
// No realiza ninguna operación sobre el archivo más allá de entregarlo a una función (pasada como prop) para que se maneje el archivo.

// Función Principal: Ofrecer una interfaz sencilla para que el usuario seleccione un archivo desde su dispositivo y luego invoque una acción cuando 
// el archivo esté listo para ser subido.

// Responsabilidad: Solo se encarga de manejar la selección del archivo y el disparo del evento de subida, delegando cualquier procesamiento
// o manejo adicional al componente padre que lo utiliza.


import React, { useState } from 'react';

interface FileUploaderProps {
  // Define las propiedades (props) que el componente FileUploader espera recibir.
  // onFileUpload: Esta es una función que debe ser proporcionada por el componente padre que usa FileUploader. Se llama cuando el usuario decide subir el archivo seleccionado, 
  // y recibe el archivo (file: File) como argumento
  
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  // Este estado almacena el archivo que el usuario ha seleccionado para subir. Inicialmente, su valor es null, lo que indica que no se ha seleccionado ningún archivo.
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Es una función que se ejecuta cada vez que el usuario selecciona un archivo en el campo de entrada (<input type="file">).
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // evento que se dispara cuando el usuario selecciona un archivo. event.target.files 
    // Si hay arcivos seleccionados el estado selectedFile se actualiza con el primer archivo de la lista
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    //Es ejecuta cuando el usuario hace clic en el botón de "Upload". 
    // Su propósito es iniciar el proceso de subida del archivo. si no es nula se ejecuta onFileupload para subir el archivo
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };
// Renderización del Componente
  return (
    <div>
      <input type="file" onChange={handleChange} />
      {/* Cuando el usuario hace clic en el botón, handleUpload se ejecuta, iniciando el proceso de subida. */}
      {/* Este atributo asegura que el botón esté deshabilitado si no se ha seleccionado un archivo (selectedFile es null) */}
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>
    </div>
  );
};

export default FileUploader;
