# Updates

Registro de actualizaciones relevantes hechas sobre componentes existentes de la librería (no reemplaza los changelogs de npm/tags, es un resumen legible para quien mantiene el repo).

## TableA / TableB — primera columna fija y pie de desplazamiento horizontal

**Componentes afectados:** `TableA`, `TableB`, `ScrollBar`, `TableScrollFooter` (nuevo, compartido).

**Qué cambió:**

- `TableA` y `TableB` suman `stickyFirstColumn`: la primera columna queda fija a la izquierda al desplazar la tabla en horizontal.
- `TableA` y `TableB` suman `stickyHeader`: el encabezado se mantiene visible al scrollear la página (hook compartido `useStickyHeader`).
- `TableA` y `TableB` suman `scrollFooter`: pie `position: sticky` al borde inferior de la pantalla con botones ◀ / ▶ y un slider sincronizado con el scroll. Solo aparece si la tabla es más ancha que su contenedor y reemplaza la barra horizontal propia. Colores configurables: `scrollFooterBgColor`, `scrollFooterBorderColor`, `scrollControlsColor`. Textos configurables: `scrollLeftLabel`, `scrollRightLabel`, `scrollSliderLabel`.
- `ScrollBar` suma `hideHorizontalTrack` y `scrollAreaRef` (acceso al elemento scrolleable).

**Por qué:** tablas anchas y altas obligaban a bajar hasta el pie para mover la barra horizontal, y la primera columna (el identificador de la fila) se perdía al desplazar.

**Archivos tocados:** `screens/components/TableScrollFooter/` (nuevo: pie compartido), `screens/components/TableA/` y `screens/components/TableB/` (`index.jsx`, `index.module.css`, stories); `screens/components/ScrollBar/index.jsx`; `AnteriorityUI.md`.

**Compatibilidad:** cambio aditivo; las props nuevas son opcionales y desactivadas por defecto.

## MarkdownContent / MarkdownEditor — copiado rápido de código y títulos

**Componentes afectados:** `MarkdownContent`, `MarkdownEditor`.

**Qué cambió:**

- `MarkdownContent` ahora muestra un botón de copiar (ícono `Copy` → `Check` al confirmar) en:
  - la esquina superior derecha de cada bloque de código (` ``` `), para copiar el código completo con un click.
  - al lado de cada encabezado (`h1` a `h6`), para copiar el texto del título con un click.
  - El botón aparece al pasar el mouse (o al enfocarlo con teclado) y usa el componente `Button` de la propia librería (`circle`, variante `ghost`), no un `<button>` HTML crudo.
  - Si el consumidor pasa sus propios renderers (`components.pre`, `components.code`, `components.h1`...`h6`), el botón de copiar no se fuerza — se respeta el renderer custom.
  - Nuevas props opcionales para textos (tooltips) del botón: `copyCodeLabel`, `copiedCodeLabel`, `copyTitleLabel`, `copiedTitleLabel`.
- `MarkdownEditor` suma un botón **Título** (ícono `H1`) en la toolbar, junto a los ya existentes de `H2`/`H3`, que inserta un encabezado de nivel 1 (`# `). Nuevo label configurable: `titleTooltip`.

**Por qué:** flujo pedido para poder pegar snippets de código largos y encabezados/títulos en el editor, y luego copiarlos rápido desde la vista previa sin tener que seleccionar texto a mano.

**Archivos tocados:**
- `screens/components/MarkdownContent/index.jsx` (renderers de `pre` y `h1`-`h6`)
- `screens/components/MarkdownContent/CopyButton.jsx` (nuevo — usa `Button` de la librería)
- `screens/components/MarkdownContent/index.module.css` (posicionamiento/visibilidad del botón al hover)
- `screens/components/MarkdownEditor/index.jsx` (botón Título en la toolbar)
- `AnteriorityUI.md` (documentación de props/uso actualizada)
- Stories nuevas en ambos componentes mostrando el flujo completo.

**Compatibilidad:** cambio aditivo, no rompe la API existente — todas las props nuevas son opcionales con default en español (consistente con el resto de `labels` de `MarkdownEditor`).
