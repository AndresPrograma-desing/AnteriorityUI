import React, { useState } from 'react';
import PasteImageField from './index';
import MultilinePlaceholder from '../Material-UI/Components/MultilinePlaceholder/index';
import TextField from '../Material-UI/Components/TextField/index';

export default {
  title: 'Components/PasteImageField',
  component: PasteImageField,
};

export const WithMultilinePlaceholder = {
  render: () => {
    const [value, setValue] = useState('');
    const [lastFiles, setLastFiles] = useState([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
        <PasteImageField onImagePaste={(files) => setLastFiles(files)}>
          <MultilinePlaceholder
            label="Descripción"
            placeholder="Escribe o pega una o varias imágenes (Ctrl+V)..."
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </PasteImageField>
        {lastFiles.length > 0 && (
          <small>Últimas imágenes extraídas: {lastFiles.map((f) => f.name || f.type).join(', ')}</small>
        )}
      </div>
    );
  },
};

export const WithTextField = {
  render: () => {
    const [value, setValue] = useState('');
    const [lastFiles, setLastFiles] = useState([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
        <PasteImageField onImagePaste={(files) => setLastFiles(files)}>
          <TextField
            label="Comentario"
            placeholder="Pega una imagen aquí..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </PasteImageField>
        {lastFiles.length > 0 && (
          <small>Últimas imágenes extraídas: {lastFiles.map((f) => f.name || f.type).join(', ')}</small>
        )}
      </div>
    );
  },
};

export const WithoutPreview = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <PasteImageField showPreview={false} onImagePaste={(files) => console.log('imágenes pegadas', files)}>
        <MultilinePlaceholder
          label="Notas"
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </PasteImageField>
    );
  },
};
