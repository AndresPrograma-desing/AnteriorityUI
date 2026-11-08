import React, { useState } from 'react';
import FileDropZone from './index';

export default {
  title: 'Components/FileDropZone',
  component: FileDropZone,
};

export const Vacia = {
  render: () => {
    const [file, setFile] = useState(null);
    return (
      <div style={{ maxWidth: 480 }}>
        <FileDropZone onFile={setFile} />
        <p>{file ? `Recibido: ${file.name}` : 'Sin archivo'}</p>
      </div>
    );
  },
};

export const SoloImagenesYPdf = {
  render: () => {
    const [msg, setMsg] = useState('');
    return (
      <div style={{ maxWidth: 480 }}>
        <FileDropZone
          accept="image/*,.pdf"
          label="Soltá una imagen o un PDF, pegala o hacé click"
          onFile={(f) => setMsg(`Recibido: ${f.name}`)}
          onReject={(f) => setMsg(`Formato no admitido: ${f.name}`)}
        />
        <p>{msg}</p>
      </div>
    );
  },
};

export const EnvolviendoContenido = {
  render: () => {
    const [file, setFile] = useState(null);
    return (
      <div style={{ maxWidth: 480 }}>
        <FileDropZone onFile={setFile}>
          <div style={{ padding: 24, border: '1px solid #e2e8f0', borderRadius: 12 }}>
            {file ? file.name : 'Arrastrá un archivo encima para reemplazar esto'}
          </div>
        </FileDropZone>
      </div>
    );
  },
};

export const Deshabilitada = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <FileDropZone disabled onFile={() => {}} />
    </div>
  ),
};

export const Coloreada = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <FileDropZone bgColor="#fdf2f8" borderColor="#f9a8d4" textColor="#9d174d" accentColor="#db2777" onFile={() => {}} />
    </div>
  ),
};
