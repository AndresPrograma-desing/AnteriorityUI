import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Upload, Workflow, PanelRight, FilePlus, Box, Square, Image as ImageIcon, Braces, Table2, BookOpen } from 'lucide-react';
import logoUrl from '../assets/anteriorityUI/anteriority-logo.svg';
import { sampleData, sampleSchema } from '../screens/components/MediaViewer/stories/jsonSample.js';
import MediaViewer from '../screens/components/MediaViewer/index';
import Container from '../screens/components/Container/index';
import Table from '../screens/components/Table/index';
import DrawPanel from '../screens/components/DrawPanel/index';
import Callout from '../screens/components/Callout/index';
import Frame from '../screens/components/Frame/index';
import Footer from '../screens/components/Footer/index';
import FileDropZone from '../screens/components/FileDropZone/index';
import Button from '../screens/components/Button/index';
import ScrollBar from '../screens/components/ScrollBar/index';
import JsonEditorDemo from '../screens/components/Container/stories/JsonEditorDemo';
import JsonProgressDemo from '../screens/components/DrawPanel/stories/JsonProgressDemo';
import MarkdownContent from '../screens/components/MarkdownContent/index';
import {
  APP_NAME,
  DEMO_GROUPS,
  DEMO_LABELS,
  DROPZONE_TEXT,
  FOOTER_DEMO_TEXT,
  FRAME_DEMO_TEXT,
  INTRO_MARKDOWN,
  INTRO_SUBTITLE,
  INTRO_TITLE,
  JSON_SHEET_TEXT,
  JSON_VIEW_TEXT,
  SAMPLE_SHEET,
  TASKS_COLUMN_TITLES,
  TASKS_COUNT,
  TASKS_KEY_PREFIX,
  TASKS_KEY_START,
  TASKS_TEXT,
  TASKS_TITLE,
  TASK_ASSIGNEES,
  TASK_BADGE_COLORS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_SUMMARIES,
} from './constants.js';

// ---------------------------------------------------------------------------
// Registro de demos del Playground de AppShell.
//
// Para ver otro componente en el layout real, agregá UNA entrada a `DEMOS`:
//   { id: 'mi-demo', group: 'Grupo', label: 'Texto del menú', icon: Icono, render: () => <MiComponente /> }
// El menú lateral y el título de la TopBar se arman solos a partir de esta lista.
// `render` es un componente/función: puede usar hooks (se monta como componente).
// El Playground envuelve cada demo en un Container con el label como título; las que ya arman el
// suyo (header propio, paginación) se marcan con `ownContainer: true` para no duplicarlo.
// Los textos y datos fijos viven en `./constants.js`.
// ---------------------------------------------------------------------------

// Planilla de ejemplo en memoria (con fórmulas), expuesta como blob: URL.
const buildSampleSheetUrl = async (rowCount = SAMPLE_SHEET.rowCount) => {
  const XLSX = await import('xlsx');
  const { statuses, headers, clientLabel, emailDomain, sheetName, totalLabel, averageLabel } = SAMPLE_SHEET;
  const rows = [headers];
  for (let i = 1; i <= rowCount; i++) {
    rows.push([i, `${clientLabel} ${i}`, `cliente${i}@${emailDomain}`, Math.round(Math.random() * 100000) / 100, new Date(2025, i % 12, (i % 28) + 1), statuses[i % statuses.length]]);
  }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows, { cellDates: true });
  ws[`C${rowCount + 3}`] = { t: 's', v: totalLabel };
  ws[`D${rowCount + 3}`] = { t: 'n', v: 0, f: `SUM(D2:D${rowCount + 1})` };
  ws[`C${rowCount + 4}`] = { t: 's', v: averageLabel };
  ws[`D${rowCount + 4}`] = { t: 'n', v: 0, f: `AVERAGE(D2:D${rowCount + 1})` };
  ws['!ref'] = `A1:F${rowCount + 4}`;
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
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
  return url ? <MediaViewer url={url} name={SAMPLE_SHEET.fileName} xlsxEditable /> : null;
};

const DropZoneDemo = () => {
  const [file, setFile] = useState(null);
  return (
    <div style={{ maxWidth: 520 }}>
      <FileDropZone onFile={setFile} />
      <p>{file ? `${DROPZONE_TEXT.received}: ${file.name}` : DROPZONE_TEXT.empty}</p>
    </div>
  );
};

// --- Vista "Ver JSON": bloques con título, explicación y el JSON (compartida por varias demos) ---
const toJson = (value) => JSON.stringify(value, (_, v) => (typeof v === 'function' ? JSON_VIEW_TEXT.functionPlaceholder : v), 2);

const JsonBlocks = ({ blocks }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
    {blocks.map((block) => (
      <section key={block.title}>
        <strong style={{ fontFamily: 'monospace' }}>{block.title}</strong>
        <p style={{ margin: '0.25rem 0 0.5rem', fontSize: '0.85rem', opacity: 0.75 }}>{block.description}</p>
        <ScrollBar maxHeight={260}>
          <MarkdownContent>{`\`\`\`json
${block.json}
\`\`\``}</MarkdownContent>
        </ScrollBar>
      </section>
    ))}
  </div>
);

// --- Tablero de tareas estilo Jira: Container + Table editable + DrawPanel ---
const flatBadge = (value) => ({
  variant: 'flat',
  textColor: TASK_BADGE_COLORS[value][0],
  iconColor: TASK_BADGE_COLORS[value][0],
  bgColor: TASK_BADGE_COLORS[value][1],
});

const isoDay = (offset) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);

const TAREAS_INICIALES = Array.from({ length: TASKS_COUNT }, (_, i) => ({
  id: i + 1,
  key: `${TASKS_KEY_PREFIX}${TASKS_KEY_START + i}`,
  summary: TASK_SUMMARIES[i % TASK_SUMMARIES.length],
  status: TASK_STATUSES[i % TASK_STATUSES.length].value,
  priority: TASK_PRIORITIES[(i * 3) % TASK_PRIORITIES.length].value,
  assignee: TASK_ASSIGNEES[i % TASK_ASSIGNEES.length],
  due: isoDay((i % 14) - 4),
}));

// JSON Schema de las tareas: de acá salen las columnas (títulos, enums y formato de fecha).
const TAREAS_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      summary: { type: 'string', title: TASKS_COLUMN_TITLES.summary },
      status: { type: 'string', title: TASKS_COLUMN_TITLES.status, enum: TASK_STATUSES.map((e) => e.value), enumNames: TASK_STATUSES.map((e) => e.label) },
      priority: { type: 'string', title: TASKS_COLUMN_TITLES.priority, enum: TASK_PRIORITIES.map((e) => e.value), enumNames: TASK_PRIORITIES.map((e) => e.label) },
      assignee: { type: 'string', title: TASKS_COLUMN_TITLES.assignee, enum: TASK_ASSIGNEES },
      due: { type: 'string', format: 'date', title: TASKS_COLUMN_TITLES.due },
    },
  },
};

const ContainerDemo = () => {
  const [tasks, setTasks] = useState(TAREAS_INICIALES);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState(null);
  const [showJson, setShowJson] = useState(false);

  const update = (id, changes) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  const selected = tasks.find((t) => t.id === selectedId);
  const rows = tasks.slice((page - 1) * pageSize, page * pageSize);
  const abiertas = tasks.filter((t) => t.status !== 'done').length;

  // Las columnas salen del JSON Schema: el `type` se deduce del schema (enum → options/etiquetas,
  // format date → fecha) y el uiSchema agrega la edición inline, los badges y los handlers.
  const uiSchema = {
    'ui:order': ['summary', 'status', 'priority', 'assignee', 'due'],
    summary: {
      'ui:options': {
        render: (row) => (
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{row.key}</div>
            <div>{row.summary}</div>
          </div>
        ),
      },
    },
    status: {
      'ui:widget': 'select',
      'ui:options': { width: '150px', minInputWidth: 110, selectorProps: (row) => flatBadge(row.status), onChange: (row, v) => update(row.id, { status: v }) },
    },
    priority: {
      'ui:widget': 'select',
      'ui:options': { width: '125px', minInputWidth: 90, selectorProps: (row) => flatBadge(row.priority), onChange: (row, v) => update(row.id, { priority: v }) },
    },
    assignee: {
      'ui:widget': 'select',
      'ui:options': { width: '160px', minInputWidth: 120, selectorProps: { variant: 'flat' }, onChange: (row, v) => update(row.id, { assignee: v }) },
    },
    due: {
      'ui:widget': 'datepicker',
      'ui:options': { width: '160px', minInputWidth: 110, onChange: (row, v) => update(row.id, { due: v }) },
    },
  };

  // JSON que recibe la tabla, en tres bloques con su explicación (las funciones se muestran como texto).
  const jsonBlocks = [
    { ...TASKS_TEXT.schemaBlock, json: toJson(TAREAS_SCHEMA) },
    { ...TASKS_TEXT.uiSchemaBlock, json: toJson(uiSchema) },
    { ...TASKS_TEXT.dataBlock, json: toJson(tasks.slice(0, JSON_VIEW_TEXT.previewRows)) },
  ];

  const detail = TASKS_TEXT.detail;

  return (
    <>
      <Container
        wattermark={false}
        header={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <strong>{TASKS_TITLE}</strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{TASKS_TEXT.openCount(abiertas, tasks.length)}</span>
              <Button variant="ghost" size="small" icon={showJson ? Table2 : Braces} onClick={() => setShowJson((v) => !v)}>
                {showJson ? JSON_VIEW_TEXT.backToTable : JSON_VIEW_TEXT.show}
              </Button>
            </div>
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
          {showJson ? (
            <Callout title={TASKS_TEXT.jsonCalloutTitle}>{TASKS_TEXT.jsonCallout}</Callout>
          ) : (
            <Callout title={TASKS_TEXT.hintTitle}>{TASKS_TEXT.hint}</Callout>
          )}
        </div>
        {showJson ? (
          <JsonBlocks blocks={jsonBlocks} />
        ) : (
          <Table variant="B" schema={TAREAS_SCHEMA} uiSchema={uiSchema} data={rows} rowKey="id" onRowClick={(row) => setSelectedId(row.id)} />
        )}
      </Container>

      <DrawPanel
        isOpen={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? `${selected.key} · ${selected.summary}` : ''}
        descriptionPosition="body"
        markdown={selected ? [
          `**${detail.status}:** ${TASK_STATUSES.find((e) => e.value === selected.status)?.label}`,
          '',
          `| ${detail.fieldHeader} | ${detail.valueHeader} |`,
          '|---|---|',
          `| ${detail.priority} | **${TASK_PRIORITIES.find((p) => p.value === selected.priority)?.label}** |`,
          `| ${detail.assignee} | ${selected.assignee} |`,
          `| ${detail.due} | ${new Date(`${selected.due}T00:00:00`).toLocaleDateString(detail.locale, { dateStyle: 'long' })} |`,
          '',
          `> ${selected.key} · ${selected.summary}`,
        ].join(String.fromCharCode(10)) : undefined}
        showActions={false}
      />
    </>
  );
};

// --- Planilla desde JSON: MediaViewer + botón "Ver JSON" con el schema y los datos que recibe ---
const JsonSheetDemo = () => {
  const [showJson, setShowJson] = useState(false);
  const blocks = [
    { ...JSON_SHEET_TEXT.schemaBlock, json: toJson(sampleSchema) },
    { ...JSON_SHEET_TEXT.dataBlock, json: toJson(sampleData.slice(0, JSON_VIEW_TEXT.previewRows)) },
  ];

  return (
    <Container
      wattermark={false}
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <strong>{DEMO_LABELS.mediaJson}</strong>
          <Button variant="ghost" size="small" icon={showJson ? Table2 : Braces} onClick={() => setShowJson((v) => !v)}>
            {showJson ? JSON_VIEW_TEXT.backToSheet : JSON_VIEW_TEXT.show}
          </Button>
        </div>
      }
    >
      <div style={{ padding: '1rem 0' }}>
        {showJson ? (
          <>
            <Callout title={JSON_SHEET_TEXT.calloutTitle}>{JSON_SHEET_TEXT.callout}</Callout>
            <JsonBlocks blocks={blocks} />
          </>
        ) : (
          <MediaViewer xlsxData={sampleData} xlsxSchema={sampleSchema} xlsxSheetName={JSON_SHEET_TEXT.sheetName} xlsxEditable name={JSON_SHEET_TEXT.fileName} />
        )}
      </div>
    </Container>
  );
};

// --- Introducción: qué es AnteriorityUI (MarkdownContent) + logo + dependencias, como en el README ---
const IntroDemo = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <img src={logoUrl} alt={APP_NAME} style={{ height: 96, width: 'auto' }} />
      <div>
        <h1 style={{ margin: 0 }}>{INTRO_TITLE}</h1>
        <span style={{ opacity: 0.7 }}>{INTRO_SUBTITLE}</span>
      </div>
    </div>
    <MarkdownContent>{INTRO_MARKDOWN}</MarkdownContent>
  </div>
);

export const DEMOS = [
  { id: 'intro', group: DEMO_GROUPS.intro, label: DEMO_LABELS.intro, icon: BookOpen, render: IntroDemo },
  { id: 'media-sheet', group: DEMO_GROUPS.mediaViewer, label: DEMO_LABELS.mediaSheet, icon: FileSpreadsheet, render: SampleSheet },
  { id: 'media-json', group: DEMO_GROUPS.mediaViewer, label: DEMO_LABELS.mediaJson, icon: FileSpreadsheet, ownContainer: true, render: () => <JsonSheetDemo /> },
  { id: 'media-upload', group: DEMO_GROUPS.mediaViewer, label: DEMO_LABELS.mediaUpload, icon: Upload, render: () => <MediaViewer droppable creatable xlsxEditable /> },
  { id: 'media-new', group: DEMO_GROUPS.mediaViewer, label: DEMO_LABELS.mediaNew, icon: FilePlus, render: () => <MediaViewer xlsxNew xlsxEditable /> },
  {
    id: 'container',
    group: DEMO_GROUPS.layout,
    label: DEMO_LABELS.tasksBoard,
    icon: Box,
    ownContainer: true,
    render: ContainerDemo,
  },
  {
    id: 'footer',
    group: DEMO_GROUPS.layout,
    label: DEMO_LABELS.footer,
    icon: Square,
    render: () => (
      <Footer
        left={FOOTER_DEMO_TEXT.left}
        actions={[
          { key: 'cancel', label: FOOTER_DEMO_TEXT.cancel, onClick: () => {} },
          { key: 'save', label: FOOTER_DEMO_TEXT.save, onClick: () => {} },
        ]}
      />
    ),
  },
  {
    id: 'frame',
    group: DEMO_GROUPS.layout,
    label: DEMO_LABELS.frame,
    icon: Square,
    render: () => <Frame title={FRAME_DEMO_TEXT.title} content={FRAME_DEMO_TEXT.content} />,
  },
  // Cada demo trae su propio Container/DrawPanel y un editor de JSON: `ownContainer` evita duplicar el envoltorio.
  { id: 'container-workflow', group: DEMO_GROUPS.workflow, label: DEMO_LABELS.containerWorkflow, icon: Workflow, ownContainer: true, render: () => <JsonEditorDemo /> },
  { id: 'drawpanel-workflow', group: DEMO_GROUPS.workflow, label: DEMO_LABELS.drawPanelWorkflow, icon: PanelRight, ownContainer: true, render: () => <JsonProgressDemo /> },
  { id: 'dropzone', group: DEMO_GROUPS.upload, label: DEMO_LABELS.dropzone, icon: ImageIcon, render: DropZoneDemo },
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
