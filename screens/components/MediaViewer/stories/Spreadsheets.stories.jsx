import React from 'react';
import MediaViewer from '../index';

// Genera una planilla de ejemplo en memoria (sin archivo de por medio) y la expone como blob: URL.
const buildSampleSheetUrl = async (rowCount, withFormulas = false) => {
  const XLSX = await import('xlsx');
  const header = ['ID', 'Cliente', 'Email', 'Monto', 'Fecha', 'Estado'];
  const estados = ['Pagado', 'Pendiente', 'Vencido'];
  const rows = [header];
  for (let i = 1; i <= rowCount; i++) {
    rows.push([i, `Cliente ${i}`, `cliente${i}@ejemplo.com`, Math.round(Math.random() * 100000) / 100, new Date(2025, i % 12, (i % 28) + 1), estados[i % 3]]);
  }
  const wb = XLSX.utils.book_new();
  const ventas = XLSX.utils.aoa_to_sheet(rows, { cellDates: true });
  if (withFormulas) {
    // Fila de totales con fórmulas reales (el visor las recalcula al editar los montos)
    ventas[`D${rowCount + 3}`] = { t: 'n', v: 0, f: `SUM(D2:D${rowCount + 1})` };
    ventas[`C${rowCount + 3}`] = { t: 's', v: 'Total' };
    ventas[`D${rowCount + 4}`] = { t: 'n', v: 0, f: `AVERAGE(D2:D${rowCount + 1})` };
    ventas[`C${rowCount + 4}`] = { t: 's', v: 'Promedio' };
    ventas['!ref'] = `A1:F${rowCount + 4}`;
  }
  XLSX.utils.book_append_sheet(wb, ventas, 'Ventas');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Resumen'], ['Total filas', rowCount]]), 'Resumen');
  const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return URL.createObjectURL(new Blob([buffer], { type: 'application/octet-stream' }));
};

const SheetStory = ({ rows, withFormulas = false, ...args }) => {
  const [url, setUrl] = React.useState(null);
  React.useEffect(() => {
    let created;
    buildSampleSheetUrl(rows, withFormulas).then((u) => {
      created = u;
      setUrl(u);
    });
    return () => created && URL.revokeObjectURL(created);
  }, [rows]);
  return url ? <div style={{ maxWidth: 720 }}><MediaViewer url={url} type="xlsx" name="ventas.xlsx" {...args} /></div> : null;
};

export default {
  title: 'Components/MediaViewer/Planillas (Excel)',
  component: MediaViewer,
};

export const Xlsx = { render: () => <SheetStory rows={200} /> };

export const XlsxEditable = {
  render: () => (
    <SheetStory
      rows={20}
      withFormulas
      xlsxEditable
      onXlsxChange={(change) => console.log('Cambio', change)}
    />
  ),
};

export const XlsxNueva = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <MediaViewer xlsxNew name="ventas-2025.xlsx" onXlsxChange={(change) => console.log('Cambio', change)} />
    </div>
  ),
};

export const XlsxMuchasFilas = { render: () => <SheetStory rows={50000} /> };

export const XlsxColoresPersonalizados = {
  render: () => (
    <SheetStory
      rows={100}
      xlsxAccentColor="#f80404ff"
      xlsxHeaderBgColor="#ebd809ff"
      xlsxBorderColor="#e300e7ff"
      xlsxBgColor="#0906f0ff"
    />
  ),
};

// Validación de datos por rango: en «Monto» (columna D) solo números, en «Cliente» (B) solo letras y números
// y en «Fecha» (E) solo fechas. Probá escribir un valor no válido: no se guarda y aparece el aviso.
export const XlsxConValidaciones = {
  render: () => (
    <SheetStory
      rows={20}
      xlsxEditable
      xlsxValidations={[
        { range: 'D2:D21', type: 'number', message: 'Monto: solo números' },
        { range: 'B2:B21', type: 'alphanumeric' },
        { range: 'E2:E21', type: 'date' },
      ]}
    />
  ),
};
