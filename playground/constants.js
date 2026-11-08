// ---------------------------------------------------------------------------
// Valores fijos del Playground: textos visibles, URLs y datos de ejemplo.
// Van acá (y no sueltos en los .jsx) siguiendo la convención del repo: `export const` en MAYÚSCULAS.
// ---------------------------------------------------------------------------

// --- Marca, enlaces y usuario de demostración ---
export const APP_NAME = 'AnteriorityUI';
export const REPO_URL = 'https://github.com/AndresPrograma-desing/AnteriorityUI';
export const STORIES_URL = 'https://andresprograma-desing.github.io/AnteriorityUI/?path=/story/components-schemaform--schema-referencia';
export const DEMO_USER_EMAIL = 'anteriorityui@example.com';

// --- Shell: TopBar, menú de usuario, Footer y Frame de Stories ---
export const TOPBAR_TOOLTIPS = {
  stories: 'Ver Stories',
  notifications: 'Notificaciones',
  help: 'Ayuda',
};

export const USER_MENU_LABELS = {
  profile: 'Mi perfil',
  logout: 'Cerrar sesión',
};

export const FOOTER_TEXT = {
  leftPrefix: 'Playground',
  repoAction: 'Ver en GitHub',
};

export const STORIES_FRAME_TEXT = {
  title: 'Stories de AnteriorityUI',
  content: 'Cada componente tiene su story en Storybook (publicado en GitHub Pages) con todas sus variantes y props. Abrí la referencia de SchemaForm o navegá desde ahí al resto.',
  close: 'Cerrar',
  open: 'Ir a las Stories',
};

// --- Menú de demos: grupos y etiquetas ---
export const DEMO_GROUPS = {
  intro: 'Inicio',
  mediaViewer: 'MediaViewer',
  layout: 'Layout',
  upload: 'Carga',
};

export const DEMO_LABELS = {
  intro: 'Introducción',
  mediaSheet: 'Planilla de ventas',
  mediaJson: 'Planilla desde JSON',
  mediaUpload: 'Cargar archivo',
  mediaNew: 'Planilla nueva',
  tasksBoard: 'Tablero de tareas',
  footer: 'Footer',
  frame: 'Frame',
  dropzone: 'FileDropZone',
};

// --- Vista "Ver JSON" (compartida) ---
export const JSON_VIEW_TEXT = {
  show: 'Ver JSON',
  backToTable: 'Ver tabla',
  backToSheet: 'Ver planilla',
  functionPlaceholder: '[función]',
  previewRows: 3,
};

// --- Introducción ---
export const INTRO_TITLE = 'anteriority-ui';
export const INTRO_SUBTITLE = 'Librería de componentes React reutilizables';

export const INTRO_MARKDOWN = [
  '## ¿Qué es AnteriorityUI?',
  '',
  '`anteriority-ui` es una librería de componentes **React** para reutilizar entre proyectos. Reúne ~50 componentes (tablas, formularios, paneles, visor de archivos, gráficos…) construidos sobre **MUI**, **CSS Modules** y **lucide-react**, con una tipografía y un sistema de colores consistentes.',
  '',
  '- **Personalizable por props:** todo color visible se puede cambiar con `bgColor`, `textColor`, `iconColor`, `borderColor` o `accentColor`, sin pelear con CSS externo.',
  '- **Guiada por datos:** `Table`, `SchemaForm` y `MediaViewer` arman columnas, formularios y planillas a partir de un JSON Schema.',
  '- **Documentada:** cada componente tiene su story en Storybook y su sección en `AnteriorityUI.md`.',
  '',
  '## Instalación',
  '',
  '```bash',
  'pnpm add anteriority-ui',
  'pnpm add react react-dom @mui/material @emotion/react @emotion/styled',
  '```',
  '',
  '```jsx',
  "import { Button, Sidebar, Table } from 'anteriority-ui';",
  '```',
  '',
  '## Qué hay en este Playground',
  '',
  'El menú lateral muestra los componentes dentro del layout real (sidebar + topbar). Probá la **planilla desde JSON**, el **tablero de tareas** y usá el botón **Ver JSON** para ver el schema y los datos que alimentan cada uno.',
  '',
  '## Dependencias',
  '',
  'Es una capa fina sobre estas librerías: todo el trabajo pesado de renderizado, accesibilidad e interacción lo hacen ellas.',
  '',
  '| Librería | Uso |',
  '|---|---|',
  '| **MUI** | Base de `Button`, `Selector`, `Search`, `TextField`, `Paginador`, `Checks`, `Swich`… |',
  '| **lucide-react** | Set principal de íconos de interfaz. |',
  '| **react-icons** | Íconos de marcas, tecnologías y UI adicionales. |',
  '| **Recharts** | Motor de `Chart` para líneas y barras. |',
  '| **Nivo** (`@nivo/pie`, `@nivo/calendar`) | Motor de `Chart` para torta y calendario de actividad. |',
  '| **Storybook** | Catálogo navegable de componentes con variantes reales. |',
  '| **react-markdown** + **remark-gfm** | Motor de `MarkdownContent` y `MarkdownEditor`. |',
  '| **Mermaid** | Diagramas en bloques ```` ```mermaid ```` de `MarkdownContent`. |',
  '| **date-fns** y **date-holidays** | Fechas y feriados en `CalendarPicker`. |',
  '| **pdfjs-dist** | Render de PDFs en `MediaViewer` (opcional). |',
  '| **SheetJS** (`xlsx`) y **fast-formula-parser** | Lectura de planillas y fórmulas del editor de Excel (opcionales). |',
  '| **docx-preview** | Preview de `.docx` en `MediaViewer`. |',
  '| **@rjsf/core** | Motor de `SchemaForm` (formularios desde JSON Schema). |',
].join('\n');

// --- Planilla de ventas (generada en memoria) ---
export const SAMPLE_SHEET = {
  rowCount: 40,
  fileName: 'ventas.xlsx',
  sheetName: 'Ventas',
  headers: ['ID', 'Cliente', 'Email', 'Monto', 'Fecha', 'Estado'],
  statuses: ['Pagado', 'Pendiente', 'Vencido'],
  clientLabel: 'Cliente',
  emailDomain: 'ejemplo.com',
  totalLabel: 'Total',
  averageLabel: 'Promedio',
};

// --- Planilla desde JSON ---
export const JSON_SHEET_TEXT = {
  fileName: 'tareas.xlsx',
  sheetName: 'Tareas',
  calloutTitle: 'Así se arma esta planilla',
  callout: 'La planilla no se carga desde un archivo .xlsx: se genera a partir de un JSON. xlsxSchema define las columnas y sus validaciones, y xlsxData trae las filas. Sirve para mostrar y editar en formato Excel lo que devuelva un backend, y exportarlo a .xlsx.',
  schemaBlock: {
    title: 'xlsxSchema',
    description: 'JSON Schema de cada fila. Define las columnas de la planilla (títulos), el tipo de cada una y las validaciones: required, minimum/maximum, minLength/maxLength, enum (lista desplegable), pattern, format (date, date-time, email). Las celdas que no cumplen se marcan en el editor.',
  },
  dataBlock: {
    title: 'xlsxData (primeras 3 filas)',
    description: 'Los datos: un array de objetos cuyas claves coinciden con las propiedades del schema. Cada objeto pasa a ser una fila de la planilla.',
  },
};

// --- Zona de carga de archivos ---
export const DROPZONE_TEXT = {
  received: 'Recibido',
  empty: 'Sin archivo',
};

// --- Footer y Frame de ejemplo ---
export const FOOTER_DEMO_TEXT = {
  left: '3 cambios sin guardar',
  cancel: 'Cancelar',
  save: 'Guardar',
};

export const FRAME_DEMO_TEXT = {
  title: 'Detalles',
  content: 'Marco con título y contenido de ejemplo.',
};

// --- Tablero de tareas ---
export const TASKS_TITLE = 'Tablero · Proyecto APP';
export const TASKS_COUNT = 53;
export const TASKS_KEY_PREFIX = 'APP-';
export const TASKS_KEY_START = 100;

export const TASK_STATUSES = [
  { value: 'todo', label: 'Por hacer' },
  { value: 'progress', label: 'En curso' },
  { value: 'review', label: 'En revisión' },
  { value: 'done', label: 'Hecho' },
];

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];

export const TASK_ASSIGNEES = ['Ana Gómez', 'Luis Pérez', 'Marta Ruiz', 'Carlos Díaz', 'Sofía Luna'];

export const TASK_SUMMARIES = [
  'Diseñar pantalla de login', 'Corregir error al exportar PDF', 'Migrar tabla de usuarios', 'Agregar filtros al listado',
  'Revisar permisos de roles', 'Optimizar consulta de reportes', 'Actualizar documentación de la API', 'Implementar modo oscuro',
];

// Colores de badge (variante flat del Selector) por estado y prioridad: [texto, fondo].
export const TASK_BADGE_COLORS = {
  todo: ['#475569', '#e2e8f0'],
  progress: ['#1d4ed8', '#dbeafe'],
  review: ['#92400e', '#fef3c7'],
  done: ['#166534', '#dcfce7'],
  low: ['#475569', '#e2e8f0'],
  medium: ['#1d4ed8', '#dbeafe'],
  high: ['#9a3412', '#ffedd5'],
  critical: ['#991b1b', '#fee2e2'],
};

export const TASKS_COLUMN_TITLES = {
  summary: 'Tarea',
  status: 'Estado',
  priority: 'Prioridad',
  assignee: 'Responsable',
  due: 'Vence',
};

export const TASKS_TEXT = {
  openCount: (open, total) => `${open} abiertas de ${total}`,
  hintTitle: 'Tareas del sprint',
  hint: 'Cambiá el estado, la prioridad, el responsable o la fecha directo en la tabla. Hacé click en una fila para ver el detalle en el panel lateral.',
  jsonCalloutTitle: 'Así se arma esta tabla',
  jsonCallout: 'Esta tabla no tiene las columnas escritas a mano: se genera a partir de un JSON. El schema define las columnas, el uiSchema define cómo se ven y se editan, y data trae las filas. Sirve para armar tablas dinámicas desde lo que devuelva un backend, sin tocar código.',
  schemaBlock: {
    title: 'schema',
    description: 'JSON Schema: describe la forma de cada tarea. De acá la tabla saca las columnas, sus títulos, las opciones de los selects (enum) y el tipo de dato (por ejemplo, format "date" = fecha).',
  },
  uiSchemaBlock: {
    title: 'uiSchema',
    description: 'Cómo se muestra y se edita cada campo: el widget de la celda (select, datepicker), el orden de las columnas, anchos y handlers. Las funciones no viajan en un JSON real, por eso se ven como "[función]".',
  },
  dataBlock: {
    title: 'data (primeras 3 filas)',
    description: 'Los datos: un array de objetos cuyas claves coinciden con las propiedades del schema. Cada objeto es una fila; si llega otro JSON con el mismo schema, la tabla se arma sola.',
  },
  detail: {
    status: 'Estado',
    fieldHeader: 'Campo',
    valueHeader: 'Valor',
    priority: 'Prioridad',
    assignee: 'Responsable',
    due: 'Vence',
    locale: 'es-AR',
  },
};
