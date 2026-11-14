# Changelog

Todos los cambios relevantes de `anteriority-ui` se anotan acá. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); las versiones siguen [semver](https://semver.org/lang/es/) y se publican con un tag `vX.Y.Z` (ver "Versionado y releases" en el [README](README.md)).

Al hacer un cambio visible para quien consume la librería, se agrega una línea en **Sin publicar** (agrupada en Agregado / Cambiado / Corregido / Obsoleto / Eliminado). Al publicar, esa sección pasa a llevar el número de versión y la fecha.

## [Sin publicar]

### Agregado

- Componente `ProgressLine`: línea de progreso (continua o punteada, horizontal o vertical) con relleno animado; es la pieza que ahora usa `Stepper` para sus conectores y su barra compacta.
- Componente `Stepper`: indicador de pasos para workflows/wizards (horizontal y vertical), con estados completado/activo/pendiente/error, pasos clicables, íconos o imágenes (SVG, URL, componente) por paso y props de color. Es responsive según su propio ancho: en contenedores angostos oculta las etiquetas por paso y muestra "Paso X de N".

- `Container`: nuevas props `showStepper`, `steps`, `activeStep`, `onStepClick` y `stepperProps` para integrar el `Stepper` arriba del contenido, igual que la paginación.
- `Container`: nuevas props `schema`, `uiSchema`, `formData`, `onFormChange`, `onFormSubmit`, `onFormError`, `formDisabled`, `showFormSubmit` y `schemaFormProps` para renderizar un formulario desde un JSON Schema. Funciona con o sin `Stepper`; con `Stepper`, cada paso puede traer su propio `schema`.
- `SchemaForm`: los campos se pueden repartir en columnas con `'ui:options': { columns: N }` en el `uiSchema` del objeto (`columnFlow: 'column'` para llenar columna por columna, `colSpan` por campo). Vuelve a una columna en formularios angostos.
- `Input` y `TextField`: nueva variante `variant="underline"` (sin caja, solo la línea inferior) con `lineColor` y `lineFocusColor`. En `SchemaForm`, `inputVariant="underline"` la aplica a todos los campos de texto/número (o por campo con `'ui:options': { variant }`). La variante `underline` también existe en `InputWithIcon` y `MultilinePlaceholder`/`FormTextArea`. Los formularios del `Container` usan `underline` por defecto (`schemaFormProps={{ inputVariant: 'outlined' }}` para volver a la caja).
- `Container`: nuevas props `loading`, `loadingText`, `loadingVariant`, `loadingColor` y `loadingProps`: mientras `loading` es true se oculta el `Stepper`, el formulario y la paginación y se muestra un `Loading` con la variante `skeleton` por defecto, que dibuja la forma del contenido (stepper y campos del formulario) cuando hay `showStepper` o `schema` (útil cuando los pasos y el schema vienen de un JSON).
- `Container`: nuevas props `wattermarkText`, `wattermarkProps` (passthrough al banner de marca de agua) y `schemaMissingLabel`.

- Storybook: stories **Container (JSON)** con un editor de JSON en vivo (wizard y solo formulario) para probar los `steps`/`schema`/`uiSchema` que espera el `Container`.
- `Container`: nueva prop `formLoading` (skeleton solo donde va el formulario, sin ocultar el `Stepper`) y `onFormSubmit` recibe un 3er argumento `{ step, stepData }` con el paso enviado y solo sus campos (para guardar cada paso por separado).
- `Stepper`: `activeStep === steps.length` marca todos los pasos como completados, y nuevas props `activeLoading` / `steps[i].loading` para mostrar un spinner en el paso en curso (seguimiento de un proceso).
- `Stepper`: nuevas props `lineStyle` (`'dashed'` = conectores punteados) y `stepGap` (espacio entre pasos en vertical); en vertical la línea ahora siempre toca el círculo. Con `icon` en el paso, `activeLoading` conserva el ícono y muestra un aro que gira.
- `DrawPanel`: nuevas props `showCancelButton` y `showConfirmButton` para mostrar solo uno de los botones del footer (ej. solo "Cerrar" al terminar un proceso).
- `DrawPanel`: nuevas props `showStepper`, `steps`, `activeStep`, `onStepClick` y `stepperProps` para mostrar un `Stepper` vertical con el progreso de un envío por etapas, con la paleta del panel.

### Corregido

- `Selector`: el desplegable ya no queda más angosto que el campo cuando el selector es ancho; toma como mínimo el ancho del input (y crece según el contenido, hasta 480px).
- `SchemaForm` sin `formData` controlado: ya no se reinicia el campo en cada tecla (no se podía escribir).

## [1.18.1] - 2026-11-10

### Corregido

- El peer opcional `xlsx` ahora acepta `^0.18.5 || ^0.20.3`. Antes exigía `^0.20.3`, que no existe en npm (la última publicada es 0.18.5), así que instalar `anteriority-ui` 1.18.0 fallaba al resolver dependencias. La versión oficial de SheetJS (0.20.3, desde su CDN) sigue funcionando.
- Documentación de instalación de `xlsx` (README, AnteriorityUI.md, skill del consumidor): aclara que es un peer opcional que el consumidor instala, y cómo resolver el error `No matching version found for xlsx@^0.20.3`.

## [1.18.0] - 2026-11-08

### Agregado

- **`Footer`**: barra inferior reutilizable con zonas izquierda/centro/derecha, botones de acción (`actions`, con el `Button` de la librería), `sticky`, colores y alto configurables. Los strings se muestran con `Text`; `textProps` y `actionProps` reenvían props a los hijos.
- **`FileDropZone`**: zona para cargar un archivo por arrastre, pegado (Ctrl/Cmd+V) o click, con filtro `accept`. Se extrajo de `MediaViewer` y ahora es un componente público.
- **`MediaViewer` — planillas** (`.xlsx`, `.xls`, `.csv`):
  - Visor/editor con edición de celdas, fórmulas (`fast-formula-parser`), deshacer/rehacer, pegado desde Excel, guardado y calculadora flotante de selección.
  - Planilla en blanco (`xlsxNew`) y modo `droppable`/`creatable` para cargar o crear una.
  - **Planilla desde JSON** (`xlsxData` + `xlsxSchema`): columnas, títulos y validaciones salen de un JSON Schema; las fechas ISO pasan a fechas reales; `onXlsxSave` entrega además `data` tipada.
  - **Validación de datos** por rango (menú «Validar datos…» o prop `xlsxValidations`): letras, números, enteros, fechas, patrón, `enum`, mínimo/máximo, largo y `required`; el valor inválido no se guarda y se avisa el motivo.
  - Reconocimiento de fechas en texto ISO; menú contextual con «Editar fecha…», «Elegir fecha…», «Insertar fecha de hoy» e «Insertar fecha y hora actual».
  - Columnas y filas redimensionables arrastrando el borde del encabezado (`Resizable`).
- **`Table`**: celda `datepicker` (fecha editable con `CalendarPicker`) y `selectorProps` en las columnas `select` (ej. `Selector` en variante `flat` como badge por fila).
- **`Container`**: topbar propio (`header`, `stickyHeader`, `headerBgColor`, `headerTextColor`, `headerBorderColor`).
- **`DrawPanel`**: `descriptionPosition="body"` para mostrar la descripción/`markdown` como contenido del cuerpo, no pegada al título.
- **`Radio`**: variante `card` (`variant`, `radius`, `bgColor`, `borderColor`) y colores libres `accentColor`/`textColor`.
- **`CalendarPicker`**: `defaultOpen` y `onClose`.
- **`FloatingPanel`** y **`QRCode`**: nuevos componentes (documentados en `AnteriorityUI.md`).
- Utilidades compartidas: `useCopyToClipboard`, `copyToClipboard`, `downloadBlob`.
- **Playground** (`playground/`): story `Playground/AppShell` para ver componentes dentro del layout real (sidebar + topbar), con demos de tablero de tareas, planillas y más.
- Storybook publicado en GitHub Pages (workflow `storybook.yml`) y logo vectorial `assets/anteriorityUI/anteriority-logo.svg`.
- Tooling: `pnpm check-scroll` (auditor de scroll nativo), skill interna `native-scroll-audit` y hook que avisa al escribir scroll nativo.

### Cambiado

- `Table`: los botones de las columnas `actions` ahora son `small` por default (cada acción puede pedir otro `size`) y el borde de la tabla pasa de 12 a 6 px de radio.
- `MediaViewer`: las stories se separaron por tipo de media dentro de `screens/components/MediaViewer/stories/`.
- Stories y playground: datos de ejemplo reemplazados por datos ficticios, archivos de stories de `MediaViewer` renombrados al inglés y textos del playground movidos a `playground/constants.js`. El playground suma una pestaña de introducción, la vista «Ver JSON» y un enlace a las Stories.
- El menú contextual del visor de planillas usa el `ScrollBar` de la librería en vez de la barra nativa.

### Corregido

- `ScrollBar`: el thumb se calculaba contra el alto completo y no contra el del track (que tiene 4 px de margen por lado), por lo que al llegar al final sobresalía del contenedor y podía generar un segundo scroll en la página.
- `AppShell` (stories): el padding por defecto de Storybook hacía desbordar el `100vh` y aparecía un scroll extra.

### Obsoleto

- `TableA` y `TableB` quedan marcados como *legacy* (`@deprecated`): usar `<Table variant="A" />` / `<Table variant="B" />`. Siguen exportados.

## [1.17.0]

### Agregado

- `Carousel`, `ConfirmPopover` y la variante `flat` del `Selector` (UI-2).

## [1.16.0]

### Agregado

- Skill para consumidores (`skill/anteriority-ui/`) y el comando `anteriority-ui-install-skill` que la instala en `.claude/skills/` del proyecto (UI-1).

### Cambiado

- Ajustes en los componentes de chat, tablas, media, topbar y schema (UI-1).

## [1.15.0]

### Agregado

- Selector de emojis e íconos (`EmojiPicker`), `DynamicIcon`, íconos en markdown y rediseño del `Toast`.
