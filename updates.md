# Updates

Registro de actualizaciones relevantes hechas sobre componentes existentes de la librería (no reemplaza los changelogs de npm/tags, es un resumen legible para quien mantiene el repo).

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
