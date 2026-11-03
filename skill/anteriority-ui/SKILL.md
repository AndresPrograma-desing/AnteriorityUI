---
name: anteriority-ui
description: Guía para usar la librería anteriority-ui (componentes React sobre MUI + CSS Modules) en un proyecto consumidor. Usar cuando el código importa de 'anteriority-ui' (o de sus subpaths 'anteriority-ui/...'), cuando el usuario pide crear una pantalla, formulario, tabla, modal, notificación, layout o cualquier UI en un proyecto que tiene la librería instalada, cuando hay que elegir qué componente usar, o cuando hay que personalizar colores de un componente de la librería.
---

# anteriority-ui — guía para el consumidor

Esta skill viene empaquetada con la librería. Sirve para que la IA use los
componentes de `anteriority-ui` como están pensados, sin inventar props ni
reimplementar algo que ya existe.

## 1. Antes de escribir código: verificar el setup

Comprobá que el proyecto tenga la librería instalada (`anteriority-ui` en
`package.json`) y que las piezas base estén cargadas **una sola vez** en el
punto de entrada de la app (`main.jsx`, `index.jsx`, `App.jsx`, `_app.jsx`…):

```js
import 'anteriority-ui/common/styles/variables.css';
import 'anteriority-ui/common/styles/typography.css';
```

```jsx
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from 'anteriority-ui/common/theme/muiTheme';

<ThemeProvider theme={muiTheme}>{/* app */}</ThemeProvider>
```

Si falta alguna, agregala. Sin el `ThemeProvider` los componentes MUI usan
Roboto en vez de la tipografía de la librería; sin los CSS, los tokens
(`--font-sans`, colores) no existen.

Peer dependencies que el proyecto debe tener: `react`, `react-dom`,
`@mui/material`, `@emotion/react`, `@emotion/styled`.

Dependencias opcionales según el componente:

| Si usás… | Instalá además |
|---|---|
| `SchemaForm` | `@rjsf/core` y `@rjsf/validator-ajv8` |
| `MediaViewer` (PDFs) | `pdfjs-dist` |
| `PasswordResetPanel`, `UserEditPopover` | configurar el cliente HTTP (ver §5) |

Todo lo demás (Chart, Recharts, Nivo, lucide, react-icons, markdown, mermaid)
viene empaquetado con la librería; no instales nada extra.

## 2. Cómo importar

Importá por nombre desde el barrel. Es la forma por defecto:

```jsx
import { Button, Input, TableB, Toast } from 'anteriority-ui';
```

Subpath directo solo cuando necesitás exports nombrados que no pasan por el barrel:

```jsx
import Button, { VARIANTS, SIZES, COLORS } from 'anteriority-ui/screens/components/Button';
```

Íconos:

```jsx
import { Home, Bell, Search } from 'anteriority-ui/lucide';           // lucide-react completo
import { findIcons } from 'anteriority-ui/common/icons';              // buscar en react-icons
```

**Nombres que no son el nombre de la carpeta:**
- `Avatar` (barrel) = avatar nativo sin MUI. `ProfileAvatar` = avatar del menú de usuario (`Profile/Avatar`). No los confundas.
- `CalendarComponent` = selector de fecha con modal. `CalendarPicker` = otro selector con dos variantes. Revisá la doc antes de elegir.
- `Barnner` se escribe así (con doble "n"), es el nombre real exportado.
- `FormControls` no tiene default export: importá `FormCard`, `FormInput` o `FormTextArea` por nombre.

## 3. Antes de usar un componente: leer su documentación

**No inventes props.** La fuente de verdad es la documentación completa, que viaja
en el paquete instalado:

```
node_modules/anteriority-ui/AnteriorityUI.md
```

Para cada componente hay una sección `### NombreComponente` con Import, uso básico,
tabla de props (tipo, default, descripción), ejemplos y notas. Procedimiento:

1. Buscá la sección: `grep -n "^### NombreComponente" node_modules/anteriority-ui/AnteriorityUI.md`.
2. Leé solo esa sección (no todo el archivo, pesa mucho).
3. Si una prop que necesitás no aparece en la tabla, buscala en el código fuente:
   `node_modules/anteriority-ui/screens/components/<Nombre>/index.jsx`.
4. Si ni la doc ni el código la tienen, decilo. No la inventes.

Los nombres de las variantes suelen venir como constantes exportadas
(`VARIANTS`, `SIZES`, `COLORS` en Button). Usá esas constantes en vez de strings sueltos cuando existan.

## 4. Índice: qué componente usar para qué

Antes de crear un componente nuevo o escribir UI a mano, revisá si ya existe acá.
Nombres exactos del barrel.

**Layout y navegación**
- `AppShell` — layout de app: `Sidebar` + `TopBar` + área de contenido con scroll propio.
- `Sidebar` — barra lateral colapsable con grupos, subitems, badges por método HTTP y menú de usuario.
- `TopBar` — barra superior en 3 secciones (logo/breadcrumb, buscador centrado, acciones).
- `SubSidebarLayout` — dos columnas: sub-menú lateral tipo pestaña + contenido.
- `Breadcrumbs`, `MenuPopover`, `Resizable` (panel con handle arrastrable), `Container` (tarjeta con paginación opcional).

**Botones y acciones**
- `Button` — botón del sistema: `variant`, `size`, `loading`, `circle`, `icon`, tooltip integrado.
- `PlaceholderButton` — campo (numérico/texto/multilínea) + botón de guardado con estados.
- `KeyboardShortcut` — asigna un atajo global a cualquier `children` sin agregar markup.
- `CopyText` — texto con click-to-copy. `BlueLink` — enlace azul (externo o `navigate`).

**Formularios y campos**
- `Input` — `TextField` con `required` y `error`/`helperText` simplificados.
- `TextField`, `MultilinePlaceholder`, `InputWithIcon` (ícono decorativo en 3 presentaciones).
- `Selector` — select/autocomplete de opciones fijas, con selección múltiple.
- `Search` — buscador con `Autocomplete`, estado de carga y `freeSolo`.
- `CalendarPicker`, `CalendarComponent`, `HoursPicker` — fecha y hora.
- `ColorPicker` — selector de color (HEX/RGB/HSL).
- `Checks`, `Swich`, `Radio` — checkbox de permisos, toggle, radio.
- `EmojiPicker`, `EmojiPickerModal` — selector de emoji o ícono.
- `PasteImageField` — envuelve un campo para pegar imágenes con Ctrl+V.
- `FormControls` — `FormCard`, `FormInput`, `FormTextArea` para armar formularios en tarjeta.
- `SchemaForm` — formulario completo a partir de un JSON Schema (+ `uiSchema`). Requiere `@rjsf`.

**Datos, tablas y métricas**
- `Table` — tabla unificada; `variant="A"` compacta o `variant="B"` cómoda. **Para código nuevo usá `Table`.** `TableA` y `TableB` siguen existiendo como wrappers.
- `Filter` — botón "Filtrar" con panel lateral, badge de conteo y "Limpiar".
- `Paginador` — paginación con "filas por página".
- `RenderJsonSchema` — vista de solo lectura de datos guardados según un JSON Schema.
- `Chart` — gráficos: `line`/`bar` (Recharts), `pie` y calendario (Nivo).
- `CardV1` — tarjeta KPI con estados de carga/error/vacío. `SummaryCard` — resumen con gradiente y copiar.

**Feedback y estado**
- `Toast` — notificación flotante con duración, acción y barra de caducidad. Montala en un contenedor fijo y quitala de tu estado en `onClose`.
- `Callout` — aviso por `variant` (`info`, `warning`, `danger`, `success`, `neutral`), con título y cuerpo en Markdown.
- `ErrorMessage` (banner en línea con icono y título). `ErrorState` también existe en el barrel, pero no tiene sección propia en `AnteriorityUI.md`: leé su `index.jsx` antes de usarlo.
- `Loading` (varias variantes), `Skeleton` (placeholder shimmer).
- `AlertModal` — modal de alerta/confirmación con input opcional; parsea errores de API.
- `DrawPanel` — drawer deslizante con header, footer de acciones y protección contra cierre con cambios sin guardar.
- `Frame` — tarjeta con título, ícono, estado de error/carga; inline o como modal.
- `NotificationsPanel` — lista de notificaciones con scroll, descarte y estado vacío.
- `Badge`, `Barnner` (chip de estado: default/success/warning/danger), `DateTag`, `ToggleCard`, `InfoTooltip`, `ModalTooltip`, `CountdownBar`.

**Texto, contenido y chat**
- `Text` — bloque de título o párrafo (`variant`: `h1`, `h2`, `h3`, `body`, `caption`) con animaciones opcionales.
- `MarkdownContent` — renderiza Markdown con GFM. `MarkdownEditor` — editor con barra de herramientas.
- `GreenHighlight` — `<strong>` con color personalizable.
- `MediaViewer` — visor de imagen, video, audio, PDF, DOCX, Markdown según la URL/mime.
- `FileListItem` — fila de archivo con ícono por tipo.
- `ChatWindow` — ventana de chat completa. `ChatComposer` — composer con Markdown, pegado de imágenes y envío configurable.
- `ImagePastePreview` — chips de imágenes pegadas.

**Identidad de usuario**
- `Avatar` (nativo), `AvatarChip` (chip con avatar y acciones), `Profile` (encabezado de perfil), `ProfileAvatar` (avatar del menú).
- `UserEditPopover` — editar el nombre de usuario contra la API (requiere §5).
- `PasswordResetPanel` — flujo de reseteo de contraseña de un admin (requiere §5).

**Íconos**
- `DynamicIcon` — renderiza un nombre de react-icons o un emoji (el valor que devuelve `EmojiPicker`).
- `IconCatalog` — página para buscar y copiar nombres de íconos.
- `findIcons` — busca un término en todos los packs de react-icons.
- `lucide` — `anteriority-ui/lucide` re-exporta lucide-react completo.

**Otros**
- `DesplegablePanel` — fila expandible tipo acordeón. `ScrollBar` — scroll personalizado que se oculta solo.
- `Slider` — slider con color de acento y tooltip. `CommandPalette` — paleta de comandos.
- `Text`, `ToggleCard`, `Callout` — para bloques de texto y avisos dentro de layouts.

## 5. Configuración de API (solo si usás componentes con red)

`PasswordResetPanel` y `UserEditPopover` llaman a endpoints reales. Configurá el cliente
una vez al arrancar la app:

```js
import { configureApiClient } from 'anteriority-ui/common/api/client';

configureApiClient({
  baseURL: 'https://api.tu-proyecto.com',
  getAuthToken: () => localStorage.getItem('token'),
});
```

Sin esta configuración los componentes renderizan (UI inicial, carga y error) pero
las llamadas fallan en silencio. Si el usuario reporta "no guarda nada", revisá esto primero.

## 6. Personalizar colores (la convención de la librería)

Los componentes con color propio exponen props de color opcionales, con nombres
consistentes:

- `bgColor`, `textColor`, `iconColor`, `borderColor`, `accentColor`
- Nombres específicos del rol cuando ninguno de esos encaja (ej. `errorTextColor` en `AlertModal`, `mutedColor` en `Toast`).

**Regla:** para cambiar un color, buscá la prop en la doc del componente y pasala. **No**
lo hagas con CSS externo, `!important` ni selectores contra las clases de los CSS
Modules (tienen nombres hasheados y no son estables). Si una prop de color que
necesitás no existe, decilo: es una laguna de la librería, no un bug de tu código.

Los componentes con sistema `variant` (Barnner, Callout, Toast, Table…) mantienen su
variant; las props de color son un override por encima de esa paleta.

## 7. Reglas prácticas

- **Reutilizá antes de crear.** Si la UI ya existe en el índice, usala en vez de armar un `<div>` con estilos propios.
- **No mezcles MUI directo con componentes de la librería** para lo mismo. Si necesitás un componente MUI que la librería ya envuelve (`Button`, `TextField`, `Autocomplete`, etc.), usá el de la librería.
- **Respetá los props de cada componente tal como están documentados.** No pases props que no aparecen en la doc; si una falla en silencio, revisá el nombre exacto en `AnteriorityUI.md`.
- **Componentes con portal** (`DrawPanel`, `AlertModal`, `ModalTooltip`, `Frame` como modal, `EmojiPickerModal`) se renderizan sobre `document.body`. No los envuelvas en contenedores con `overflow: hidden` esperando que queden contenidos.
- **Estado controlado:** la mayoría de los componentes de entrada son controlados (`value` + `onChange`, `open` + `onClose`). Mantené el estado en tu componente.
- **Storybook de la librería** (si está disponible en el proyecto) muestra cada componente en variantes reales; úsalo como referencia visual.

## 8. Antes de dar la tarea por terminada

1. Cada componente importado existe en el barrel o en el subpath que usaste.
2. Cada prop usada aparece en la sección de `AnteriorityUI.md` de ese componente.
3. Los CSS base y el `ThemeProvider` están en el punto de entrada.
4. Si usaste `PasswordResetPanel`, `UserEditPopover` o `SchemaForm`, las dependencias y la configuración de §1 y §5 están hechas.
5. Corré el build o los tests del proyecto consumidor, y reportá lo que no pudiste verificar (por ejemplo, el aspecto visual).
