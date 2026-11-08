import React from 'react';
import MediaViewer from '../index';

export default {
  title: 'Components/MediaViewer/Carga de archivos',
  component: MediaViewer,
};

export const CargarOCrearPlanilla = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <MediaViewer droppable creatable xlsxEditable accept=".xlsx,.xls,.csv" />
    </div>
  ),
};

export const CargaPorArrastreOPegado = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <MediaViewer droppable />
    </div>
  ),
};

export const CargaSoloPlanillas = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <MediaViewer
        droppable
        accept=".xlsx,.xls,.csv"
        dropLabel="Soltá una planilla (.xlsx, .xls, .csv), pegala o hacé click"
        onFileReject={(file) => window.alert(`Formato no admitido: ${file.name}`)}
      />
    </div>
  ),
};
