<p align="center">
  <img src="assets/favicon/anteriorityUI.ico" alt="anteriority-ui" width="480" />
</p>

# anteriority-ui

Librería interna de componentes React (UI) para reutilizar entre proyectos. Construida sobre [MUI](https://mui.com/), [lucide-react](https://lucide.dev/) y CSS Modules, con [Storybook](https://storybook.js.org/) para navegar y probar cada componente de forma aislada.

## Instalación

```bash
pnpm add git+https://github.com/AndresPrograma-desing/AnteriorityUI.git
```

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

## Ver los componentes en Storybook

```bash
pnpm storybook
```

Abre `http://localhost:6006` con los ~50 componentes navegables, cada uno con varias variantes de ejemplo.

## Convención de colores

La mayoría de los componentes con color propio (fondo, texto, ícono, borde) exponen props opcionales para sobreescribirlo — por ejemplo `bgColor`, `textColor`, `iconColor`, `borderColor`, `accentColor`. Si no se pasa la prop, el componente se ve exactamente igual que antes (el valor por default reproduce el color original). Ver [AnteriorityUI.md](AnteriorityUI.md) para la lista exacta de props de color que acepta cada componente.

Componentes que ya tenían un sistema de `variant`/`type` con paletas predefinidas (`Barnner`, `DesplegablePanel`, `Notification/Error`, `TableB`) lo conservan tal cual — las props de color nuevas son un override opcional por encima del `variant` elegido.

## Componentes

Documentación completa de props y ejemplos de uso de los 50 componentes en **[AnteriorityUI.md](AnteriorityUI.md)**.

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
| [CardV1](AnteriorityUI.md#cardv1) | Tarjeta con badges, acción e indicadores de estado |
| [ChatWindow](AnteriorityUI.md#chatwindow) | Ventana de chat completa (mensajes, input, avatar) |
| [Checks](AnteriorityUI.md#checks) | Checkbox de permisos/ítem seleccionable |
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
| [ScrollBar](AnteriorityUI.md#scrollbar) | Contenedor con scrollbar estilizada |
| [Sidebar](AnteriorityUI.md#sidebar) | Barra lateral de navegación completa |
| [Skeleton](AnteriorityUI.md#skeleton) | Placeholders de carga (shimmer) |
| [SubSidebarLayout](AnteriorityUI.md#subsidebarlayout) | Layout de sub-sidebar con menú |
| [SummaryCard](AnteriorityUI.md#summarycard) | Tarjeta de resumen con degradado |
| [Swich](AnteriorityUI.md#swich) | Interruptor (switch) on/off |
| [TableA](AnteriorityUI.md#tablea) | Tabla simple con columnas configurables |
| [TableB](AnteriorityUI.md#tableb) | Tabla con filas expandibles y badges |
| [ToggleCard](AnteriorityUI.md#togglecard) | Tarjeta colapsable con acción |
| [UserEditPopover](AnteriorityUI.md#usereditpopover) | Popover de edición de nombre de usuario (usa `features/user-profile`) |

> `screens/components/Avatar/` existe pero está sin implementar (archivos vacíos) — no se documenta hasta que tenga contenido.
