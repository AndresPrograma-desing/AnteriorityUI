import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Upload, FilePlus, Box, Square, Image as ImageIcon } from 'lucide-react';
import { sampleData, sampleSchema } from '../screens/components/MediaViewer/stories/jsonSample.js';
import MediaViewer from '../screens/components/MediaViewer/index';
import Container from '../screens/components/Container/index';
import Table from '../screens/components/Table/index';
import DrawPanel from '../screens/components/DrawPanel/index';
import Callout from '../screens/components/Callout/index';
import Frame from '../screens/components/Frame/index';
import Footer from '../screens/components/Footer/index';
import FileDropZone from '../screens/components/FileDropZone/index';

// ---------------------------------------------------------------------------
// Registro de demos del Playground de AppShell.
//
// Para ver otro componente en el layout real, agregá UNA entrada a `DEMOS`:
//   { id: 'mi-demo', group: 'Grupo', label: 'Texto del menú', icon: Icono, render: () => <MiComponente /> }
// El menú lateral y el título de la TopBar se arman solos a partir de esta lista.
// `render` es un componente/función: puede usar hooks (se monta como componente).
// ---------------------------------------------------------------------------

// Planilla de ejemplo en memoria (con fórmulas), expuesta como blob: URL.
const buildSampleSheetUrl = async (rowCount = 40) => {
  const XLSX = await import('xlsx');
  const estados = ['Pagado', 'Pendiente', 'Vencido'];
  const rows = [['ID', 'Cliente', 'Email', 'Monto', 'Fecha', 'Estado']];
  for (let i = 1; i <= rowCount; i++) {
    rows.push([i, `Cliente ${i}`, `cliente${i}@ejemplo.com`, Math.round(Math.random() * 100000) / 100, new Date(2025, i % 12, (i % 28) + 1), estados[i % 3]]);
  }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows, { cellDates: true });
  ws[`C${rowCount + 3}`] = { t: 's', v: 'Total' };
  ws[`D${rowCount + 3}`] = { t: 'n', v: 0, f: `SUM(D2:D${rowCount + 1})` };
  ws[`C${rowCount + 4}`] = { t: 's', v: 'Promedio' };
  ws[`D${rowCount + 4}`] = { t: 'n', v: 0, f: `AVERAGE(D2:D${rowCount + 1})` };
  ws['!ref'] = `A1:F${rowCount + 4}`;
  XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
  const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return URL.createObjectURL(new Blob([buffer], { type: 'application/octet-stream' }));
};

const SampleSheet = () => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let created;
    buildSampleSheetUrl().then((u) => {
      created = u;
      setUrl(u);
    });
    return () => created && URL.revokeObjectURL(created);
  }, []);
  return url ? <MediaViewer url={url} name="ventas.xlsx" xlsxEditable /> : null;
};

const DropZoneDemo = () => {
  const [file, setFile] = useState(null);
  return (
    <div style={{ maxWidth: 520 }}>
      <FileDropZone onFile={setFile} />
      <p>{file ? `Recibido: ${file.name}` : 'Sin archivo'}</p>
    </div>
  );
};

// --- Tablero de tareas estilo Jira: Container + Table editable + DrawPanel ---
const ESTADOS = [
  { value: 'todo', label: 'Por hacer' },
  { value: 'progress', label: 'En curso' },
  { value: 'review', label: 'En revisión' },
  { value: 'done', label: 'Hecho' },
];
const PRIORIDADES = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];
const RESPONSABLES = ['Ana Gómez', 'Luis Pérez', 'Marta Ruiz', 'Carlos Díaz', 'Sofía Luna'].map((n) => ({ value: n, label: n }));
const RESUMENES = [
  'Diseñar pantalla de login', 'Corregir error al exportar PDF', 'Migrar tabla de usuarios', 'Agregar filtros al listado',
  'Revisar permisos de roles', 'Optimizar consulta de reportes', 'Actualizar documentación de la API', 'Implementar modo oscuro',
];
// Colores de badge (variante flat del Selector) por estado y prioridad.
const BADGE = {
  todo: ['#475569', '#e2e8f0'], progress: ['#1d4ed8', '#dbeafe'], review: ['#92400e', '#fef3c7'], done: ['#166534', '#dcfce7'],
  low: ['#475569', '#e2e8f0'], medium: ['#1d4ed8', '#dbeafe'], high: ['#9a3412', '#ffedd5'], critical: ['#991b1b', '#fee2e2'],
};
const flatBadge = (value) => ({ variant: 'flat', textColor: BADGE[value][0], iconColor: BADGE[value][0], bgColor: BADGE[value][1] });

const isoDay = (offset) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);

const TAREAS_INICIALES = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  key: `APP-${100 + i}`,
  summary: `${RESUMENES[i % RESUMENES.length]}`,
  status: ESTADOS[i % ESTADOS.length].value,
  priority: PRIORIDADES[(i * 3) % PRIORIDADES.length].value,
  assignee: RESPONSABLES[i % RESPONSABLES.length].value,
  due: isoDay((i % 14) - 4),
}));

const ContainerDemo = () => {
  const [tasks, setTasks] = useState(TAREAS_INICIALES);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState(null);

  const update = (id, changes) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  const selected = tasks.find((t) => t.id === selectedId);
  const rows = tasks.slice((page - 1) * pageSize, page * pageSize);
  const abiertas = tasks.filter((t) => t.status !== 'done').length;

  const columns = [
    {
      key: 'summary',
      label: 'Tarea',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{row.key}</div>
          <div>{row.summary}</div>
        </div>
      ),
    },
    {
      key: 'status', label: 'Estado', type: 'select', options: ESTADOS, width: '150px', minInputWidth: 110, selectorProps: (row) => flatBadge(row.status),
      onChange: (row, v) => update(row.id, { status: v }),
    },
    { key: 'priority', label: 'Prioridad', type: 'select', options: PRIORIDADES, width: '125px', minInputWidth: 90, selectorProps: (row) => flatBadge(row.priority), onChange: (row, v) => update(row.id, { priority: v }) },
    { key: 'assignee', label: 'Responsable', type: 'select', options: RESPONSABLES, width: '160px', minInputWidth: 120, selectorProps: { variant: 'flat' }, onChange: (row, v) => update(row.id, { assignee: v }) },
    { key: 'due', label: 'Vence', type: 'datepicker', width: '160px', minInputWidth: 110, onChange: (row, v) => update(row.id, { due: v }) },
  ];

  return (
    <>
      <Container
        wattermark={false}
        header={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <strong>Tablero · Proyecto APP</strong>
            <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{abiertas} abiertas de {tasks.length}</span>
          </div>
        }
        showPagination
        paginationCount={Math.ceil(tasks.length / pageSize)}
        paginationPage={page}
        onPaginationChange={(_, value) => setPage(value)}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      >
        <div style={{ padding: '1rem 0 0' }}>
          <Callout title="Tareas del sprint">
            {'Cambiá el estado, la prioridad, el responsable o la fecha directo en la tabla. Hacé click en una fila para ver el detalle en el panel lateral.'}
          </Callout>
        </div>
        <Table variant="B" columns={columns} data={rows} rowKey="id" onRowClick={(row) => setSelectedId(row.id)} />
      </Container>

      <DrawPanel
        isOpen={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? `${selected.key} · ${selected.summary}` : ''}
        descriptionPosition="body"
        markdown={selected ? [
          `**Estado:** ${ESTADOS.find((e) => e.value === selected.status)?.label}`,
          '',
          '| Campo | Valor |',
          '|---|---|',
          `| Prioridad | **${PRIORIDADES.find((p) => p.value === selected.priority)?.label}** |`,
          `| Responsable | ${selected.assignee} |`,
          `| Vence | ${new Date(`${selected.due}T00:00:00`).toLocaleDateString('es-AR', { dateStyle: 'long' })} |`,
          '',
          `> ${selected.key} · ${selected.summary}`,
        ].join(String.fromCharCode(10)) : undefined}
        showActions={false}
      />
    </>
  );
};

export const DEMOS = [
  { id: 'media-sheet', group: 'MediaViewer', label: 'Planilla de ventas', icon: FileSpreadsheet, render: SampleSheet },
  { id: 'media-json', group: 'MediaViewer', label: 'Planilla desde JSON', icon: FileSpreadsheet, render: () => <MediaViewer xlsxData={sampleData} xlsxSchema={sampleSchema} xlsxSheetName="Tareas" xlsxEditable name="tareas.xlsx" /> },
  { id: 'media-upload', group: 'MediaViewer', label: 'Cargar archivo', icon: Upload, render: () => <MediaViewer droppable creatable xlsxEditable /> },
  { id: 'media-new', group: 'MediaViewer', label: 'Planilla nueva', icon: FilePlus, render: () => <MediaViewer xlsxNew xlsxEditable /> },
  {
    id: 'container',
    group: 'Layout',
    label: 'Tablero de tareas',
    icon: Box,
    render: ContainerDemo,
  },
  {
    id: 'footer',
    group: 'Layout',
    label: 'Footer',
    icon: Square,
    render: () => (
      <Footer
        left="3 cambios sin guardar"
        actions={[
          { key: 'cancel', label: 'Cancelar', onClick: () => {} },
          { key: 'save', label: 'Guardar', onClick: () => {} },
        ]}
      />
    ),
  },
  {
    id: 'frame',
    group: 'Layout',
    label: 'Frame',
    icon: Square,
    render: () => <Frame title="Detalles" content="Marco con título y contenido de ejemplo." />,
  },
  { id: 'dropzone', group: 'Carga', label: 'FileDropZone', icon: ImageIcon, render: DropZoneDemo },
];

// Agrupa DEMOS en el formato `groups` del Sidebar.
export const buildGroups = (demos = DEMOS) => {
  const map = new Map();
  demos.forEach(({ group, id, label, icon }) => {
    if (!map.has(group)) map.set(group, []);
    map.get(group).push({ id, label, icon });
  });
  return [...map].map(([title, items]) => ({ title, items }));
};
