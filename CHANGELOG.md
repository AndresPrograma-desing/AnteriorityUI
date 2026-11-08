# Changelog

Todos los cambios relevantes de `anteriority-ui` se anotan acá. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); las versiones siguen [semver](https://semver.org/lang/es/) y se publican con un tag `vX.Y.Z` (ver "Versionado y releases" en el [README](README.md)).

Al hacer un cambio visible para quien consume la librería, se agrega una línea en **Sin publicar** (agrupada en Agregado / Cambiado / Corregido / Obsoleto / Eliminado). Al publicar, esa sección pasa a llevar el número de versión y la fecha.

## [Sin publicar]

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
