<p align="center">
  <img src="assets/favicon/anteriorityUI.ico" alt="anteriority-ui" width="480" />
</p>

# anteriority-ui

Librería interna de componentes React (UI) para reutilizar entre proyectos. Construida sobre [MUI](https://mui.com/), [lucide-react](https://lucide.dev/) y CSS Modules, con [Storybook](https://storybook.js.org/) para navegar y probar cada componente de forma aislada. El componente `Chart` se apoya en [Recharts](https://recharts.org/) y en los paquetes de [Nivo](https://nivo.rocks/) (`@nivo/pie`, `@nivo/calendar`) para sus distintos tipos de gráfico — ambos vienen empaquetados como `dependencies`, sin que el proyecto consumidor tenga que instalarlos aparte.

## Instalación

Publicada en el registro público de npm — se instala igual que cualquier otra dependencia, sin tokens ni configuración extra:

```bash
pnpm add anteriority-ui
```

Cada versión se genera a partir de un tag `vX.Y.Z` (semver real, no el HEAD de `main`) — ver [Versionado y releases](#versionado-y-releases).

### Peer dependencies

Estas dependencias las provee el proyecto que consume la librería (no van empaquetadas, para evitar duplicar React/MUI):

```bash
pnpm add react react-dom @mui/material @emotion/react @emotion/styled
```

## Setup en el proyecto consumidor

1. Importar los estilos base (design tokens + tipografía) una sola vez, en el punto de entrada de la app:

   ```js
   import 'anteriority-ui/common/styles/variables.css';
   import 'anteriority-ui/common/styles/typography.css';
   ```

2. Envolver la app en el `ThemeProvider` de MUI con el theme de la librería, para que los componentes basados en MUI (Button, TextField, Selector, etc.) usen la misma tipografía y no el Roboto por default de MUI:

   ```jsx
   import { ThemeProvider } from '@mui/material/styles';
   import muiTheme from 'anteriority-ui/common/theme/muiTheme';

   function App() {
     return (
       <ThemeProvider theme={muiTheme}>
         {/* resto de la app */}
       </ThemeProvider>
     );
   }
   ```

3. (Opcional) Si vas a usar `hooks/useAdminPasswordReset` o cualquier función de `features/*/api.js`, configurá el cliente HTTP genérico una vez al arrancar la app:

   ```js
   import { configureApiClient } from 'anteriority-ui/common/api/client';

   configureApiClient({
     baseURL: 'https://api.tu-proyecto.com',
     getAuthToken: () => localStorage.getItem('token'),
   });
   ```

4. (Opcional) Si vas a usar `SchemaForm`, agregá `@rjsf/core` y un validador (ej. `@rjsf/validator-ajv8`) — ver [AnteriorityUI.md#schemaform](AnteriorityUI.md#schemaform):

   ```bash
   pnpm add @rjsf/core @rjsf/validator-ajv8
   ```

5. (Opcional) Si vas a mostrar PDFs con `MediaViewer`, agregá `pdfjs-dist` (el worker ya viene empaquetado con la librería, pero la librería en sí no — es `peerDependency` opcional para no duplicarla si tu proyecto ya la usa):

   ```bash
   pnpm add pdfjs-dist
   ```

## Importar componentes

Todos los componentes están indexados en el entry point principal — no hace falta conocer el subpath de cada uno:

```jsx
import { Button, Sidebar, TableB } from 'anteriority-ui';
```

Alternativa, importando el subpath directo de cada componente (útil para acceder a exports nombrados extra que no pasan por el barrel, ej. `Button.VARIANTS`):

```jsx
import Button, { VARIANTS } from 'anteriority-ui/screens/components/Button';
```

Para íconos de interfaz genéricos ([lucide-react](https://lucide.dev/) empaquetado, sin instalar nada extra):

```jsx
import { Home, Bell, Search } from 'anteriority-ui/lucide';
```

Para íconos de marcas/tecnologías/UI (react-icons empaquetado, sin instalar nada extra), ver la sección "Icons (react-icons)" en [AnteriorityUI.md](AnteriorityUI.md). Para buscar/listar esos íconos programáticamente sin conocer de antemano en qué pack vive cada uno, `anteriority-ui/common/icons` expone `findIcons`, `ICON_PACKS` y `ICON_PACK_NAMES` (ver [findIcons](AnteriorityUI.md#findicons)).

## Estructura del proyecto

```
screens/components/   → componentes de UI (uno por carpeta, ver docs abajo)
common/
  styles/             → variables.css (design tokens) y typography.css (fuente global)
  theme/              → muiTheme.js, el theme de MUI compartido
  api/                → cliente HTTP genérico (client.js), sin lógica de negocio
  storage/            → utilidades de localStorage/sessionStorage (LocalStorage.js)
features/
  password-reset/     → lógica de API para el flujo de reseteo de contraseña
  user-profile/       → lógica de API para edición de perfil de usuario
hooks/                → hooks reutilizables (useAdminPasswordReset)
.storybook/           → configuración de Storybook
```

Cada componente en `screens/components/` es independiente entre sí salvo por composición explícita (por ejemplo, `Button` usa `ModalTooltip`, `TableB` usa `Barnner`). Ningún componente de UI importa nada de `features/` directamente salvo los que ya tienen lógica de negocio propia (`PasswordResetPanel`, `UserEditPopover`).

## Versionado y releases

La librería se compila (JSX → JS, se preserva la estructura de carpetas) antes de publicarse — ver [scripts/build.mjs](scripts/build.mjs). El build corre solo en CI, no hace falta ejecutarlo a mano salvo para probarlo localmente con `pnpm run build`.

**Setup único, antes del primer release:** generar un [access token de npm](https://www.npmjs.com/) de tipo *Automation* (desde la cuenta/organización de npm que va a ser dueña del paquete) y cargarlo como secret `NPM_TOKEN` en Settings → Secrets and variables → Actions de este repo. Sin esto el workflow de publish falla.

Para publicar una nueva versión (ej. después de un fix en un componente):

```bash
pnpm version patch   # o minor / major — bumpea package.json, commitea y crea el tag vX.Y.Z
git push && git push --tags
```

El push del tag dispara [.github/workflows/publish.yml](.github/workflows/publish.yml), que compila y publica a npm con el secret `NPM_TOKEN`. El workflow falla si el tag no coincide con la versión del `package.json`, como chequeo de seguridad.

Los proyectos consumidores controlan cuándo actualizar corriendo `pnpm update anteriority-ui` (respetando el rango semver que hayan fijado), en vez de recibir cambios de golpe con cada push a `main`.

## Ver los componentes en Storybook

```bash
pnpm storybook
```

Abre `http://localhost:6006` con los ~50 componentes navegables, cada uno con varias variantes de ejemplo.

## Convención de colores

La mayoría de los componentes con color propio (fondo, texto, ícono, borde) exponen props opcionales para sobreescribirlo — por ejemplo `bgColor`, `textColor`, `iconColor`, `borderColor`, `accentColor`. Si no se pasa la prop, el componente se ve exactamente igual que antes (el valor por default reproduce el color original). Ver [AnteriorityUI.md](AnteriorityUI.md) para la lista exacta de props de color que acepta cada componente.

Componentes que ya tenían un sistema de `variant`/`type` con paletas predefinidas (`Barnner`, `DesplegablePanel`, `Notification/Error`, `TableB`) lo conservan tal cual — las props de color nuevas son un override opcional por encima del `variant` elegido.

## Componentes

Documentación completa de props y ejemplos de uso de los ~50 componentes en **[AnteriorityUI.md](AnteriorityUI.md)** (también disponible en formato navegable en [context-hub-memory](https://context-hub-memory.vercel.app/share/sessions/7b8538aa-4563-4a34-b5f4-6c372deb3345), misma documentación).

| Componente | Descripción |
|---|---|
| [AlertModal](AnteriorityUI.md#alertmodal) | Modal de confirmación/alerta, con soporte de input embebido |
| [Badge](AnteriorityUI.md#badge) | Etiqueta de estado con ícono, label y valor |
| [Barnner](AnteriorityUI.md#barnner) | Banner de aviso con variantes de color |
| [BlueLink](AnteriorityUI.md#bluelink) | Link de navegación con tooltip |
| [Breadcrumbs](AnteriorityUI.md#breadcrumbs) | Migas de pan de navegación |
| [Button](AnteriorityUI.md#button) | Botón (envoltorio de MUI Button) con variantes, loading, tooltip |
| [CalendarComponent](AnteriorityUI.md#calendarcomponent) | Selector de fecha standalone (date picker) |
| [CalendarPicker](AnteriorityUI.md#calendarpicker) | Selector de fecha integrado a un `TextField` |
| [Callout](AnteriorityUI.md#callout) | Caja de aviso/notificación con variantes de color y cuerpo en Markdown |
| [CardV1](AnteriorityUI.md#cardv1) | Tarjeta con badges, acción e indicadores de estado |
| [Chart](AnteriorityUI.md#chart) | Gráficos (línea, barra, torta, calendario de actividad), con título/descripción en Markdown y slot de acciones |
| [ChatWindow](AnteriorityUI.md#chatwindow) | Ventana de chat completa (mensajes, input, avatar) |
| [Checks](AnteriorityUI.md#checks) | Checkbox de permisos/ítem seleccionable |
| [ColorPicker](AnteriorityUI.md#colorpicker) | Selector de color (HEX/RGB/HSL) con popover de saturación/matiz |
| [Container](AnteriorityUI.md#container) | Contenedor con paginación integrada |
| [CopyText](AnteriorityUI.md#copytext) | Texto con botón de copiar al portapapeles |
| [CountdownBar](AnteriorityUI.md#countdownbar) | Barra de progreso con cuenta regresiva |
| [DateTag](AnteriorityUI.md#datetag) | Etiqueta de fecha formateada |
| [DesplegablePanel](AnteriorityUI.md#desplegablepanel) | Panel colapsable con ícono temático |
| [DrawPanel](AnteriorityUI.md#drawpanel) | Panel lateral deslizable (drawer) |
| [Filter](AnteriorityUI.md#filter) | Panel de filtros con contador de activos |
| [FormControls](AnteriorityUI.md#formcontrols) | Controles de formulario (Card, Input, TextArea) |
| [Frame](AnteriorityUI.md#frame) | Marco/tarjeta base reutilizable, soporta modal |
| [GreenHighlight](AnteriorityUI.md#greenhighlight) | Resaltado de texto/valor destacado |
| [HoursPicker](AnteriorityUI.md#hourspicker) | Selector de horario |
| [InfoTooltip](AnteriorityUI.md#infotooltip) | Ícono de información con tooltip |
| [Input](AnteriorityUI.md#input) | Input de texto (envoltorio de MUI TextField) |
| [Loading](AnteriorityUI.md#loading) | Indicadores de carga (spinner, barras, rebote) |
| [MarkdownContent](AnteriorityUI.md#markdowncontent) | Render de contenido Markdown |
| [MarkdownEditor](AnteriorityUI.md#markdowneditor) | Editor de Markdown con vista previa |
| [Material-UI/Components/InputWithIcon](AnteriorityUI.md#inputwithicon) | Input con ícono embebido |
| [Material-UI/Components/MenuPopover](AnteriorityUI.md#menupopover) | Menú contextual (popover) |
| [Material-UI/Components/MultilinePlaceholder](AnteriorityUI.md#multilineplaceholder) | Textarea con placeholder multilinea |
| [Material-UI/Components/Paginador](AnteriorityUI.md#paginador) | Paginación (envoltorio de MUI Pagination) |
| [Material-UI/Components/Search](AnteriorityUI.md#search) | Buscador con autocompletado |
| [Material-UI/Components/Selector](AnteriorityUI.md#selector) | Select (envoltorio de MUI Select) |
| [Material-UI/Components/TextField](AnteriorityUI.md#textfield) | TextField base compartido por otros componentes |
| [ModalTooltip](AnteriorityUI.md#modaltooltip) | Tooltip flotante (portal) |
| [Notification/Error/ErrorMessage](AnteriorityUI.md#errormessage) | Mensaje de error/éxito inline |
| [PasswordResetPanel](AnteriorityUI.md#passwordresetpanel) | Panel de flujo de reseteo de contraseña (usa `features/password-reset`) |
| [PlaceholderButton](AnteriorityUI.md#placeholderbutton) | Botón que se convierte en input al hacer click |
| [Profile](AnteriorityUI.md#profile) | Header de perfil de usuario |
| [Profile/Avatar](AnteriorityUI.md#avatar-profileavatar) | Avatar con estado (online/offline) |
| [SchemaForm](AnteriorityUI.md#schemaform) | Formulario generado desde un JSON Schema (wrapper de rjsf) |
| [ScrollBar](AnteriorityUI.md#scrollbar) | Contenedor con scrollbar estilizada |
| [Sidebar](AnteriorityUI.md#sidebar) | Barra lateral de navegación completa |
| [Skeleton](AnteriorityUI.md#skeleton) | Placeholders de carga (shimmer) |
| [Slider](AnteriorityUI.md#slider) | Slider horizontal controlado (input range) |
| [SubSidebarLayout](AnteriorityUI.md#subsidebarlayout) | Layout de sub-sidebar con menú |
| [SummaryCard](AnteriorityUI.md#summarycard) | Tarjeta de resumen con degradado |
| [Swich](AnteriorityUI.md#swich) | Interruptor (switch) on/off |
| [TableA](AnteriorityUI.md#tablea) | Tabla simple con columnas configurables |
| [TableB](AnteriorityUI.md#tableb) | Tabla con filas expandibles y badges |
| [ToggleCard](AnteriorityUI.md#togglecard) | Tarjeta colapsable con acción |
| [UserEditPopover](AnteriorityUI.md#usereditpopover) | Popover de edición de nombre de usuario (usa `features/user-profile`) |

> `screens/components/Avatar/` existe pero está sin implementar (archivos vacíos) — no se documenta hasta que tenga contenido.

## Créditos

`anteriority-ui` es una capa fina de componentes construida sobre estas librerías — todo el trabajo pesado de renderizado, accesibilidad y lógica de interacción lo hacen ellas:

<p align="left">
  <a href="https://mui.com/"><img alt="MUI" src="https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white"></a>
  <a href="https://lucide.dev/"><img alt="lucide-react" src="https://img.shields.io/badge/lucide--react-F56565?style=for-the-badge&logo=lucide&logoColor=white"></a>
  <a href="https://react-icons.github.io/react-icons/"><img alt="react-icons" src="https://img.shields.io/badge/react--icons-61DAFB?style=for-the-badge&logo=react&logoColor=black"></a>
  <a href="https://recharts.org/"><img alt="Recharts" src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logoColor=white"></a>
  <a href="https://nivo.rocks/"><img alt="Nivo" src="https://img.shields.io/badge/Nivo-E8762D?style=for-the-badge&logoColor=white"></a>
  <a href="https://storybook.js.org/"><img alt="Storybook" src="https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white"></a>
  <a href="https://github.com/remarkjs/react-markdown"><img alt="react-markdown" src="https://img.shields.io/badge/react--markdown-000000?style=for-the-badge&logo=markdown&logoColor=white"></a>
  <a href="https://mermaid.js.org/"><img alt="Mermaid" src="https://img.shields.io/badge/Mermaid-FF3670?style=for-the-badge&logo=mermaid&logoColor=white"></a>
  <a href="https://date-fns.org/"><img alt="date-fns" src="https://img.shields.io/badge/date--fns-770C56?style=for-the-badge&logoColor=white"></a>
</p>

| Librería | Uso en la librería |
|---|---|
| [**MUI**](https://mui.com/) | Base de los componentes `Material-UI/Components/*` (`Selector`, `Search`, `TextField`, `Paginador`, etc.) y de piezas como `Button`, `Checks`, `Swich`. |
| [**lucide-react**](https://lucide.dev/) | Set principal de íconos de interfaz, empaquetado y re-exportado en `anteriority-ui/lucide`. |
| [**react-icons**](https://react-icons.github.io/react-icons/) | Set de íconos de marcas/tecnologías/UI adicional, empaquetado y documentado en la sección "Icons (react-icons)" de [AnteriorityUI.md](AnteriorityUI.md). |
| [**Recharts**](https://recharts.org/) | Motor de `Chart` para `type="line"` y `type="bar"`. |
| [**Nivo**](https://nivo.rocks/) (`@nivo/pie`, `@nivo/calendar`) | Motor de `Chart` para `type="pie"` y `type="nivo-calendar"`. |
| [**Storybook**](https://storybook.js.org/) | Catálogo navegable de los ~50 componentes, con variantes de ejemplo reales. |
| [**react-markdown**](https://github.com/remarkjs/react-markdown) + [**remark-gfm**](https://github.com/remarkjs/remark-gfm) | Motor de `MarkdownContent`/`MarkdownEditor` (tablas, listas de tareas, GFM completo). |
| [**Mermaid**](https://mermaid.js.org/) | Renderizado de diagramas dentro de bloques ` ```mermaid ` en `MarkdownContent`. |
| [**date-fns**](https://date-fns.org/) | Manejo de fechas en `CalendarPicker`/`CalendarComponent`. |
| [**date-holidays**](https://github.com/commenthol/date-holidays) | Feriados reales por país en `CalendarPicker`. |
| [**pdfjs-dist**](https://mozilla.github.io/pdf.js/) | Render de PDFs en `MediaViewer` (peer dependency opcional). |
| [**docx-preview**](https://github.com/VolodymyrBaydalka/docxjs) | Preview de documentos `.docx` en `MediaViewer`. |
| [**@rjsf/core**](https://rjsf-team.github.io/react-jsonschema-form/) | Motor de `SchemaForm` (formularios desde JSON Schema). |
