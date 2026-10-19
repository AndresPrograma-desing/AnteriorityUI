import { useState } from 'react';
import FileListItem from './index';

export default {
  title: 'Components/FileListItem',
  component: FileListItem,
};

export const Basico = {
  args: {
    name: 'Product Backlog - Happy Pets v2.pdf',
    size: '114.7 KB',
    date: '16/10/2026',
  },
};

export const ConSeleccion = {
  args: {
    name: 'hu_v2.md',
    size: '19.5 KB',
    date: '16/10/2026',
    selectable: true,
    selected: false,
  },
};

export const ConAccionesDefault = {
  args: {
    name: 'Historias Usuario.docx',
    size: '30.8 KB',
    date: '15/10/2026',
    selectable: true,
    onShare: () => console.log('compartir'),
    onDownload: () => console.log('descargar'),
    onDelete: () => console.log('eliminar'),
  },
};

export const ConAccionesPersonalizadas = {
  args: {
    name: 'SANYA TEKK_Slowed_MP3_160K_.mp3',
    size: '2.7 MB',
    date: '15/10/2026',
    selectable: true,
    actions: <button type="button" onClick={() => console.log('editar')}>Editar</button>,
  },
};

export const Clickeable = {
  args: {
    name: 'contrato-firmado.pdf',
    size: '812 KB',
    date: '10/10/2026',
    onClick: () => console.log('abrir archivo'),
  },
};

export const ListaCompleta = {
  render: () => {
    const [items, setItems] = useState([
      { id: 1, name: 'Product Backlog - Happy Pets v2.pdf', size: '114.7 KB', date: '16/10/2026', selected: false },
      { id: 2, name: 'hu_v2.md', size: '19.5 KB', date: '16/10/2026', selected: false },
      { id: 3, name: 'Historias Usuario.docx', size: '30.8 KB', date: '15/10/2026', selected: false },
      { id: 4, name: 'SANYA TEKK_Slowed_MP3_160K_.mp3', size: '2.7 MB', date: '15/10/2026', selected: false },
    ]);

    const toggle = (id, checked) =>
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, selected: checked } : item)));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
        {items.map((item) => (
          <FileListItem
            key={item.id}
            name={item.name}
            size={item.size}
            date={item.date}
            selectable
            selected={item.selected}
            onSelectChange={(checked) => toggle(item.id, checked)}
            onShare={() => console.log('compartir', item.name)}
            onDownload={() => console.log('descargar', item.name)}
            onDelete={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
          />
        ))}
      </div>
    );
  },
};

export const ColoresPersonalizados = {
  args: {
    name: 'reporte-ventas.xlsx',
    size: '45 KB',
    date: '01/10/2026',
    bgColor: '#f8fafc',
    borderColor: '#cbd5e1',
    textColor: '#0f172a',
    metaColor: '#475569',
  },
};
