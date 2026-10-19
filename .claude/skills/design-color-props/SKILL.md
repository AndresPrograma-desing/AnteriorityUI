---
name: design-color-props
description: Audita un componente de AnteriorityUI en busca de colores hardcodeados (CSS module, inline style, sx, color= de MUI) y aplica props de color opcionales (bgColor/textColor/iconColor/borderColor/accentColor) siguiendo la convención del repo, incluyendo la propagación a sub-componentes internos que no heredan los tokens del padre. Usar cuando se agrega o toca un componente visual, cuando el usuario pide que un componente sea "personalizable" o "temeable", o cuando se sospecha que falta alguna prop de color.
---

# Design color props (AnteriorityUI)

Esta skill existe porque el objetivo de la convención de props de color
(ver "Convención: props de color" en CLAUDE.md) es que quien consume la
librería pueda adaptar la paleta de un componente al tema de su propio
proyecto **sin pelear con overrides de CSS por fuera** (`!important`,
selectores frágiles contra CSS Modules con nombres hasheados, etc.). Todo
color visible de un componente debería poder cambiarse por prop; si algo
solo se puede recolorear escribiendo CSS externo, es una laguna que hay
que cerrar.

Caso real que motivó esta skill: `RenderJsonSchema` tenía `bgColor`/
`textColor`/`labelColor`/`borderColor` en su propio panel, pero el
`emptyValue` (texto "Sin datos") seguía con un color hardcodeado en el CSS
module, y el `MediaViewer` que usa internamente para previews de archivo
(`format: 'data-url'`) no recibía ninguna de esas props — tiene sus propios
tokens CSS (`--media-viewer-*`, distintos de los del padre) y no los hereda
solo. Resultado: un panel "oscurecido" por props dejaba el texto vacío y los
chips de archivo con su paleta clara default, a medio personalizar.

## Cuándo usarla

- El usuario pide auditar o aplicar props de color a un componente existente.
- Se está creando un componente nuevo con color propio (fondo, texto, ícono,
  borde, acento) y hay que decidir qué props de color exponer.
- Un componente renderiza internamente otro componente de la librería que
  también tiene props de color (ej. `MediaViewer`, `Barnner`, `ImagePastePreview`)
  y hay que decidir si esas props deben propagarse.
- El usuario pide que un componente sea "personalizable", "temeable", o que
  soporte un tema oscuro/paleta distinta sin tocar CSS global.

## Proceso

1. **Inventariar todo color visible del componente**, no solo el más obvio:
   - Colores en el CSS module (`background`, `color`, `border-color`,
     gradientes, `:hover`/`:focus`, pseudo-elementos).
   - Colores inline en JSX (`style={{ color: '#...' }}`, `sx={{ ... }}` de
     MUI, prop `color=` de un componente MUI).
   - Estados vacíos/placeholder/error que a veces quedan con un color
     "secundario" hardcodeado aparte del color principal (como pasó con
     `emptyValue` en `RenderJsonSchema` — fácil de olvidar porque no es el
     color "principal" del componente).
   - Sub-componentes internos de la propia librería que el componente
     renderiza (ver paso 4).
2. **Para cada color encontrado sin prop asociada**, aplicar el patrón de
   CLAUDE.md:
   - Prop opcional, nombre reutilizado si el rol coincide con uno existente
     (`bgColor`, `textColor`, `iconColor`, `borderColor`, `accentColor`), o
     un nombre específico del rol si ninguno encaja (ej. `labelColor`).
   - **El default debe reproducir exactamente el color hardcodeado que
     existía antes** — es aditivo, nunca un rediseño.
   - Si el color vive en el CSS module: convertirlo a
     `var(--token-local, <valor-original>)` y aplicar
     `style={{ '--token-local': prop }}` en el componente solo cuando la
     prop viene definida, mergeando con cualquier `style` que ya reciba.
   - Si el color ya estaba inline en JSX: reemplazar el literal por la prop,
     con ese mismo valor como default de parámetro.
   - Componentes con sistema `variant`/`type` (Barnner, DesplegablePanel,
     Notification/Error, TableB) mantienen su variant tal cual — las props
     de color son un override opcional por encima de la paleta que
     resolvería el variant, no un reemplazo del sistema de variantes.
3. **Revisar estados secundarios** (vacío, deshabilitado, error, hover) con
   la misma vara que el estado principal — no asumir que solo el color
   "central" del componente importa.
4. **Propagar a sub-componentes internos de la librería.** Si el componente
   renderiza otro componente de `screens/components/` que también tiene
   props de color propias, verificar si ese sub-componente usa los *mismos*
   tokens CSS que el padre (en cuyo caso la herencia de CSS custom
   properties ya alcanza, no hace falta nada más) o tokens *propios*
   (`--media-viewer-*` vs. `--rjs-*`, por ejemplo — en cuyo caso no heredan
   solos). Cuando son tokens propios, pasar las props de color recibidas
   hacia ese sub-componente explícitamente (como prop, no como CSS var),
   mapeando el rol que corresponda (ej. `bgColor`/`borderColor`/`textColor`
   del padre → las mismas props del hijo).
5. **Actualizar `AnteriorityUI.md`**: agregar las props nuevas a la tabla de
   Props del componente, y una nota si hay algo no obvio (ej. qué props se
   propagan a un sub-componente y cuáles no, o un default que reproduce un
   valor específico).
6. **Actualizar el `.stories.jsx`** con una variante real que ejercite las
   props de color nuevas (no un placeholder) — útil como prueba visual y
   como referencia para la documentación.
7. **Validar**: `pnpm check-case` y `pnpm build` (incluye `verify-dist`)
   deben pasar limpios antes de dar la tarea por terminada.

## Qué NO hacer

- No agregar una prop de color para algo que no es visualmente un color
  propio del componente (ej. no exponer `shadowColor` si la sombra es parte
  fija del sistema de elevación, no algo que varíe por tema).
- No cambiar el valor default de ningún color existente — el único cambio
  permitido es volverlo configurable, nunca redecidir qué color usa por
  default.
- No romper componentes con `variant`/`type` reemplazando su paleta
  resuelta por variant con las props de color nuevas — las props son un
  override por encima, el variant sigue siendo la fuente por default.
- No asumir que un sub-componente interno hereda colores solo porque está
  anidado en el DOM — confirmar si usa los mismos tokens CSS o tokens
  propios antes de dar la propagación por hecha.
