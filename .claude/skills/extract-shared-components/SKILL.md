---
name: extract-shared-components
description: Audita AnteriorityUI en busca de bloques de UI (JSX/CSS) o lógica no-visual (hooks, utilidades) duplicados o candidatos a reutilizarse entre componentes, y propone o aplica su extracción a una pieza compartida nueva (componente en screens/components/, o hook/utilidad en common/) siguiendo las convenciones del repo. Usar cuando se sospecha duplicación entre dos o más componentes, antes de escribir UI o lógica que se parezca a algo ya existente, o cuando el usuario pide revisar/auditar reuso en esta librería.
---

# Extract shared components (AnteriorityUI)

Esta skill existe porque, en esta librería, UI o lógica repetida entre
componentes debe vivir en **una pieza compartida propia**, no duplicada
copia-pega ni acoplada como código interno de un solo "componente dueño". La
razón (dada explícitamente por el usuario del repo): una pieza propia escala —
si después se le agrega algo, mejora automáticamente en todos los lugares
donde se usa, en vez de tener que replicar el cambio a mano en cada copia.

Según la naturaleza de lo que se duplica, el destino es distinto (ver
"Estructura" en CLAUDE.md):
- **UI visual** (JSX + CSS, algo que se renderiza) → componente nuevo en
  `screens/components/<Nombre>/`.
- **Lógica no-visual** (manejo de eventos, estado, side effects sin JSX
  propio) → hook o utilidad nueva en `common/` (ej. `common/hooks/`).

Casos reales que motivaron esta regla:
- `MultilinePlaceholder` y `PasteImageField` tenían cada uno su propia copia
  casi idéntica de un chip (miniatura + badge + botón de quitar) para el
  preview de imágenes pegadas → se extrajo a
  `screens/components/ImagePastePreview/` (UI visual).
- `TopBar` y `Sidebar` reimplementaban cada uno a mano un listener de
  `keydown` para sus atajos (Ctrl/Cmd+K del `CommandPalette`, Ctrl/Cmd+B para
  colapsar) → se extrajo a `common/hooks/useKeyboardShortcut.js` (lógica
  no-visual, sin JSX), más un wrapper `screens/components/KeyboardShortcut/`
  para asignar atajos a cualquier `children` (`Button`, `Input`, etc.) desde
  JSX sin agregar la lógica como prop de un componente puntual — el usuario
  prefirió explícitamente el wrapper sobre una prop `shortcut` en `Button`
  porque así el mismo mecanismo sirve para cualquier elemento, incluso en un
  proyecto consumidor externo.

## Cuándo usarla

- El usuario pide auditar/revisar duplicación o reuso de componentes o lógica.
- Estás por escribir un bloque de UI (aunque sea chico: un chip, un badge, un
  preview, un empty state) y notás que algo visualmente similar ya existe en
  otro componente de `screens/components/`.
- Estás por escribir lógica no-visual (ej. un listener de teclado, un debounce,
  un hook de estado) y notás que algo equivalente ya existe reimplementado en
  otro componente.
- Es razonablemente probable que el bloque que estás escribiendo se reutilice
  en más de un lugar a futuro.

## Proceso

1. **Encontrar candidatos.** Buscar en `screens/components/**/index.jsx` y
   `**/index.module.css` patrones de JSX/CSS que se repitan entre dos o más
   componentes: mismas clases con nombres equivalentes (`.preview`/
   `.imagePreview`), misma estructura de elementos (ícono + texto + botón de
   cerrar), mismos valores de color/spacing hardcodeados repetidos. Usar Grep
   para buscar fragmentos de CSS o patrones de JSX similares entre carpetas.
2. **Confirmar que es la misma pieza conceptual**, no solo una coincidencia
   superficial. Dos chips con fondo gris y texto no son necesariamente el
   mismo componente si cumplen roles distintos — mirar si visualmente
   comunican lo mismo y si cambiarían juntos ante un mismo pedido de diseño.
3. **Decidir el nombre y alcance** del componente nuevo. Debe ser
   suficientemente genérico para los usos actuales sin sobre-generalizar para
   casos hipotéticos (ver regla de no over-engineering de CLAUDE.md).
4. **Crear el componente nuevo** en `screens/components/<Nombre>/` siguiendo
   el patrón exacto del repo:
   - `index.jsx` — con props explícitas, valores de color opcionales con
     default (ver "Convención: props de color" en CLAUDE.md).
   - `index.module.css` — estilos propios, usando `var(--token-local,
     <default>)` para las props de color.
   - `constants.js` — si hay valores fijos no-prop (colores default, labels
     default), en MAYÚSCULAS, importados por `index.jsx`.
   - `index.stories.jsx` — con variantes reales (no placeholders).
5. **Refactorizar los componentes originales** para que usen el nuevo
   componente compartido en vez de su copia duplicada. Verificar que el
   comportamiento visible no cambie (mismo output visual, misma API externa
   de los componentes originales) salvo que el usuario haya pedido también un
   cambio de diseño.
6. **Agregar al barrel** `index.js` (alfabéticamente, alias = nombre de
   carpeta, solo `export default`).
7. **Documentar en `AnteriorityUI.md`**: sección nueva para el componente
   compartido (Import/Uso básico/Props/Ejemplos/Notas), y actualizar las
   secciones de los componentes que ahora lo reutilizan para que sus notas
   mencionen la reutilización en vez de describir un chip propio.
8. **Validar**: `pnpm check-case` y `pnpm build` (incluye `verify-dist`) deben
   pasar limpios antes de dar la tarea por terminada.

## Qué NO hacer

- No extraer algo a un componente propio por una sola ocurrencia — la regla
  aplica a partir de 2+ usos reales o claramente inminentes, no especulativos.
- No crear una abstracción configurable de más (props para cada variación
  imaginable) — extraer lo que efectivamente varía entre los usos actuales,
  nada más.
- No romper la API pública de los componentes que se refactorizan: sus props
  externas deben seguir funcionando igual para quien ya los usa.
