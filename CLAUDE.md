
# CLAUDE.md

Guía para trabajar en este repo. Para documentación orientada a consumidores de la librería, ver [README.md](README.md) (instalación, setup, estructura) y [AnteriorityUI.md](AnteriorityUI.md) (props y ejemplos de uso de cada uno de los 50 componentes, en un único documento).

## Qué es este proyecto

`anteriority-ui` es una librería interna de componentes React, extraída originalmente del proyecto `vet-system-WEB` (en `C:\Users\Usuario\ProjectoUniversidad\vet-system-WEB`), con el objetivo de reutilizarla en otros proyectos. Los componentes viven en `screens/components/` y están construidos sobre MUI + CSS Modules + lucide-react.

## Estructura

```
index.js              → barrel: re-exporta los ~50 componentes por nombre (import { Button } from 'anteriority-ui')
screens/components/   → ~50 componentes de UI, uno por carpeta (index.jsx + .module.css + .stories.jsx, siempre en minúscula)
common/
  table/              → piezas internas compartidas por TableA/TableB (TableScrollFooter); no son componentes públicos
  styles/             → variables.css (design tokens en :root) y typography.css (fuente global + import de Google Fonts)
  theme/muiTheme.js   → theme de MUI compartido (fontFamily: var(--font-sans))
  api/client.js       → cliente HTTP genérico (fetch wrapper), sin lógica de negocio ni endpoints hardcodeados
  storage/LocalStorage.js → utilidades de sessionStorage/localStorage (getUserId/setUserId)
features/
  password-reset/api.js  → funciones de API específicas del flujo de reseteo de contraseña
  user-profile/api.js    → función de API para actualizar nombre de usuario
hooks/useAdminPasswordReset.js → hook que consume features/password-reset/api.js
.storybook/           → config de Storybook (main.js, preview.jsx)
```

**Regla de separación:** `screens/components/*` es UI pura y reutilizable. `features/*` y `hooks/*` son lógica de negocio (llamadas a API con endpoints concretos) — solo dos componentes dependen de ellos (`PasswordResetPanel`, `UserEditPopover`), y ambos siguen funcionando/renderizando sin crashear aunque no haya backend real detrás (las llamadas fallan silenciosamente, atrapadas en try/catch).

## Origen y por qué existen `common/api`, `features/`, `hooks/`

Al extraer componentes de `vet-system-WEB`, algunos (`Button`, `Sidebar`, `PasswordResetPanel`, `UserEditPopover`, etc.) importaban cosas fuera del árbol de componentes: `ModalTooltip`, `AlertModal`, `Notification/Error/ErrorMessage` (ya copiados dentro de `screens/components/`), y lógica real de negocio (`services/api`, `hooks/useAdminPasswordReset`, `context/LocalStorage`). Para esta última parte, en vez de copiar el cliente API completo de vet-system-WEB (771 líneas acopladas a axios/config/dummyDB/tokens de esa app específica), se reimplementó un cliente HTTP genérico (`common/api/client.js`) y solo las funciones puntuales que los dos componentes necesitan (`features/password-reset`, `features/user-profile`), para que la librería no dependa del backend de ningún proyecto en particular.

Un consumidor de la librería que quiera usar `PasswordResetPanel` o `UserEditPopover` con datos reales debe llamar `configureApiClient({ baseURL, getAuthToken })` (ver README.md) antes de que se disparen las llamadas.

## Convención: props de color

**Por qué:** el objetivo es que quien consume la librería pueda adaptar la paleta de un componente al tema de su propio proyecto sin pelear con overrides de CSS por fuera (`!important`, selectores frágiles contra CSS Modules con nombres hasheados, etc.). Todo color visible de un componente debería poder cambiarse por prop; si algo solo se puede recolorear escribiendo CSS externo, es una laguna que hay que cerrar.

La mayoría de los componentes con color propio (fondo, texto, ícono, borde) exponen props opcionales de color (`bgColor`, `textColor`, `iconColor`, `borderColor`, `accentColor`, o nombres específicos del rol cuando ninguno de esos encaja). Reglas al tocar o agregar componentes:

- **Todo prop de color es opcional y su default debe reproducir exactamente el color hardcodeado que existía antes** — es un cambio aditivo, nunca un rediseño.
- **Mecanismo:** si el color vive en el CSS module, se convierte a `var(--token-local, <valor-original>)` y el componente aplica `style={{ '--token-local': prop }}` solo cuando la prop viene definida (merge con cualquier `style` que el componente ya reciba). Esto funciona incluso para gradientes, `:hover` y contenido en portales (las CSS custom properties heredan).
- Si el color ya estaba inline en JSX (`style`, `sx`, `color=` de MUI), se reemplaza el literal por la prop con ese mismo valor como default de parámetro.
- **Los componentes con sistema `variant`/`type` (Barnner, DesplegablePanel, Notification/Error, TableB) mantienen su variant tal cual** — las props de color nuevas son un override opcional por encima de la paleta que resolvería el variant.
- Nombres reutilizados a propósito para consistencia entre componentes: `bgColor`, `textColor`, `iconColor`, `borderColor`, `accentColor`.
- **Componentes que renderizan otro componente interno con sus propias props de color** (ej. `RenderJsonSchema` usando `MediaViewer` para previews de archivo) no pueden asumir que las CSS custom properties del padre llegan solas — si el hijo lee sus propios tokens (`--media-viewer-*` en vez de los del padre), hay que propagar explícitamente las props de color recibidas hacia ese hijo. Cubrir el contenedor principal y olvidarse de los sub-componentes internos dejaría una paleta a medio personalizar.

**Verificación obligatoria al crear un componente nuevo:** todo componente visual nuevo debe poder recolorearse completamente por props antes de darse por terminado — no es opcional ni queda para "después". Usar la skill `design-color-props` (`.claude/skills/design-color-props/`) para auditar el componente (incluyendo sub-componentes internos, ver convención de descomposición más abajo) y aplicar las props de color que falten. Esto no depende de que se recuerde invocarla a mano: hay un hook `PostToolUse` sobre `Write|Edit` (`.claude/settings.json` → `.claude/hooks/remind-color-props.mjs`) que, cada vez que se escribe o edita un `index.jsx` bajo `screens/components/**/`, inyecta un recordatorio obligatorio en el contexto para correr la skill antes de cerrar la tarea.

## Convención: descomponer componentes grandes en subcomponentes

**Por qué:** un `index.jsx` que crece mezclando múltiples responsabilidades visuales (ej. un viewer que renderiza 5 tipos de media distintos, cada uno con su propia barra de controles) se vuelve difícil de leer, de tocar sin romper otro caso, y de testear/documentar por partes. Partirlo en subcomponentes mantiene cada pieza enfocada y hace que el árbol de archivos refleje la estructura visual real.

**Ejemplo de referencia: `screens/components/MediaViewer/`.** Es el componente mejor dividido del repo — úsalo como plantilla al descomponer cualquier otro:

```
MediaViewer/
  index.jsx                          → orquesta: resuelve el tipo de media y delega a cada player
  constants.js, utils.js
  components/
    index.js                         → barrel interno (solo para los sub-componentes de ESTE componente)
    VideoPlayer/
      index.jsx
      index.module.css
      components/
        index.js
        VideoControlsBar/index.jsx + .module.css
        VideoSeekBar/index.jsx + .module.css
        VideoSpeedControl/index.jsx + .module.css
        VideoCenterPlayButton/index.jsx + .module.css
        VideoErrorOverlay/index.jsx + .module.css
    AudioPlayer/      (mismo patrón: index.jsx + components/AudioPlayerSkeleton/)
    PdfViewer/        (mismo patrón: index.jsx + components/PdfControlsBar/, PdfPageJumper/)
    DocxViewer/       (mismo patrón: index.jsx + components/DocxControlsBar/)
```

Reglas al descomponer un componente que creció demasiado:
- El split va en una carpeta **`components/` interna al componente** (`screens/components/<Nombre>/components/<SubNombre>/`), no en `screens/components/` de primer nivel — estas piezas no son componentes públicos de la librería, son implementación interna de `<Nombre>`. No se agregan al barrel `index.js` raíz.
- Cada sub-componente sigue el mismo patrón que uno público: su propia carpeta con `index.jsx` + `index.module.css` (y `components/` propio si a su vez necesita dividirse — ver `VideoPlayer/components/`, dos niveles de anidación en este repo).
- El barrel `components/index.js` del componente padre re-exporta cada sub-componente por nombre (mismo mecanismo que el barrel raíz, pero con alcance local).
- El criterio de corte es responsabilidad visual, no tamaño de archivo: cada tipo de media/variante/estado complejo que el componente orquesta pasa a ser su propio sub-componente; el `index.jsx` del padre queda como orquestador (resuelve qué caso aplica y delega), no como lugar donde vive el detalle de cada caso.
- **Las props de color del componente padre se propagan explícitamente a cada sub-componente** (ver "Convención: props de color" arriba) — un sub-componente con sus propios tokens CSS no hereda la paleta del padre solo por estar anidado en el DOM.
- No hace falta tocar `scripts/build.mjs` ni `check-case` — recorren `screens/components/` recursivamente, así que la carpeta `components/` anidada ya queda cubierta.
- Usar la skill `decompose-large-component` para auditar un componente existente y aplicar este split.

## Convención: valores fijos en `constants.js`

Cuando un componente tiene valores fijos que no son props (colores por defecto, tamaños, grosores, pasos, listas de opciones, etc.), se definen en un `constants.js` dentro de la carpeta del componente (`screens/components/<Name>/constants.js`) con `export const` en MAYÚSCULAS, y el `index.jsx` los importa (`import { DEFAULT_ACCENT } from './constants.js'`). No dejar esos literales sueltos dentro del `index.jsx`. Ejemplo: `screens/components/Slider/constants.js` (`DEFAULT_ACCENT`, `DEFAULT_THICKNESS`). Ya siguen esta convención `CalendarPicker`, `ColorPicker`, `CountdownBar`, `DesplegablePanel`, `HoursPicker`, `Sidebar` y `Swich`.

## Tipografía y theme

La fuente global es **Plus Jakarta Sans** (Google Fonts), no Roboto (default de MUI) ni el serif por default del navegador. Esto requiere DOS piezas trabajando juntas:
- `common/styles/typography.css` → importa la fuente y define `body { font-family: var(--font-sans) }` (arregla elementos HTML planos, ej. un `<h3>` sin clase).
- `common/theme/muiTheme.js` → `ThemeProvider` de MUI con `typography.fontFamily: 'var(--font-sans)'` (arregla componentes MUI, que si no, ignoran el `body` y usan su propio theme default).

Si se agrega un componente nuevo con texto visible, verificar que se vea con la fuente correcta en Storybook (`.storybook/preview.jsx` ya envuelve todas las stories en ambos).

## Comandos

```bash
pnpm storybook          # levanta Storybook en http://localhost:6006
pnpm build-storybook    # build estático de Storybook
pnpm build              # check-case + compila a dist/ + verify-dist — correr antes de confiar en un release
pnpm check-case         # solo el audit de mayúsculas/minúsculas en imports (rápido, sin compilar)
```

## Barrel (`index.js`) — indexación de componentes

`index.js` en la raíz re-exporta cada componente por nombre (`export { default as Button } from './screens/components/Button/index.js'`, etc.) para que un consumidor pueda hacer `import { Button, Sidebar } from 'anteriority-ui'` sin conocer el subpath de cada uno. Es un archivo **mantenido a mano**, no generado — al agregar un componente nuevo en `screens/components/`, agregarlo también acá. Reglas:
- Alias siempre = nombre de la carpeta (no el nombre interno de la variable/función, que a veces difiere — ej. `Sidebar/index.jsx` exporta internamente `ProSidebar`, pero el barrel lo expone como `Sidebar`).
- Solo se re-exporta el `default` de cada componente, nunca `export *` — varios componentes tienen sus propios `VARIANTS`/`SIZES`/`COLORS` locales (ver [Convención: props de color](#convención-props-de-color) y el patrón `variant`/`type`) que colisionarían entre sí como named exports al tope del barrel. Quien necesite esos named exports sigue importando el subpath directo del componente.
- `screens/components/Avatar/` (el stub vacío) queda **fuera** del barrel a propósito — ver [Componentes sin implementar](#componentes-sin-implementar). El avatar real (`Profile/Avatar`) está en el barrel como `ProfileAvatar`.
- `FormControls` no tiene default export (exporta `FormCard`, `FormInput`, `FormTextArea` con nombre propio) — se re-exportan tal cual, sin alias de carpeta.

## Build y publicación (versionado real, npm público)

El paquete se publica en el registro público de npm como `anteriority-ui`, no vía `git+https://...` apuntando a `main` (ese instalaba el HEAD del branch sin versión ni changelog — ver [.github/workflows/publish.yml](.github/workflows/publish.yml)). Se eligió npm público en vez de GitHub Packages a propósito: GitHub Packages exige autenticación hasta para instalar (incluso en repos públicos), y la prioridad acá era que instalar fuera tan simple como `pnpm add mui` — sin `.npmrc` ni token del lado del consumidor. El costo es que el código queda visible públicamente en npm (el repo de GitHub puede seguir siendo privado).

- `scripts/build.mjs` transpila JSX → JS con esbuild (`jsx: 'automatic'`) y copia CSS Modules/otros assets, preservando la misma estructura de carpetas que el código fuente para que los subpath imports documentados en README.md sigan resolviendo igual. También genera `dist/package.json` (subset de campos del `package.json` raíz — ver el script para la lista exacta) porque `publishConfig.directory: "dist"` en el `package.json` raíz le dice a `pnpm publish` que empaquete desde ahí, no desde la raíz del repo.
- **Todos los imports relativos internos deben ser sin extensión** (`from '../Loading/index'`, no `'../Loading/index.jsx'`). Un import con extensión `.jsx` explícita funciona en el código fuente (Vite/Storybook resuelve contra el archivo `.jsx` real), pero rompe en `dist/` una vez compilado, porque esbuild transpila `.jsx` → `.js` sin reescribir el string del import — queda apuntando a un archivo que ya no existe. `scripts/verify-dist.mjs` (bundlea `dist/index.js` completo con esbuild, con los peer deps como `external`) es lo único que detecta esto; `pnpm build-storybook` NO alcanza porque corre contra el código fuente, no contra el paquete compilado.
- `scripts/check-case.mjs` audita que cada import relativo matchee el nombre real en disco con mayúsculas/minúsculas exactas (había 22 componentes con entry file `Index.jsx` en vez de `index.jsx` — rompía deploys en Linux por ser case-sensitive, invisible en Windows/Mac). Corre como parte de `pnpm build` y en CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)).
- **Gotcha real ya vivido:** un rename de archivo solo-de-casing (`Index.jsx` → `index.jsx`) en Windows puede quedar sin aplicar físicamente en disco después de un `git checkout`/merge, aunque el índice de git ya diga `index.jsx` — NTFS es case-insensitive y git a veces no reescribe el archivo físico si solo cambia el casing. Si `pnpm check-case` falla después de un pull que "debería" traer un fix de casing ya mergeado, sospechar de esto antes de asumir que el fix nunca se aplicó.
- El workflow de publish se dispara con push de un tag `vX.Y.Z` y valida que coincida con la versión de `package.json` antes de publicar — ver la sección "Versionado y releases" en README.md para el flujo (`pnpm version patch/minor/major` + `git push --tags`).
- Si se agrega un componente/carpeta nueva bajo `screens/`, `common/`, `features/` o `hooks/`, no hace falta tocar nada del build — `scripts/build.mjs` recorre esos cuatro directorios dinámicamente. Sí hay que agregarlo a mano al barrel `index.js` (ver arriba).
- `react`, `react-dom`, `@mui/material`, `@emotion/*` ya son `peerDependencies` (no van empaquetados) — eso ya estaba bien resuelto antes de este cambio; lo que faltaba era el build + versionado, no las peer deps.

## ⚠️ Gotcha de pnpm workspace

`C:\Users\Usuario` (la carpeta home del usuario) es raíz de OTRO proyecto suyo no relacionado (`proyecto-hp-backend`, con su propio `package.json`/`pnpm-workspace.yaml`/`.git`). Como está dos niveles arriba de este repo, pnpm puede tratarlo como raíz del workspace y mezclar instalaciones ahí en vez de aislarlas acá. Por eso este repo tiene su propio `pnpm-workspace.yaml` (con `packages: []`) — **no lo borres** — sirve para que pnpm pare la búsqueda hacia arriba y trate `AnteriorityUI` como su propia raíz. Si algo similar vuelve a romperse (paquetes no encontrados en runtime pese a estar en `package.json`), sospechar primero de esto antes de reinstalar todo.

## Storybook

Cada componente en `screens/components/` tiene un `.stories.jsx` (formato CSF3) al lado de su implementación. Al agregar un componente nuevo, agregarle también su story con variantes reales (no placeholders) — son la referencia que se usa para escribir/actualizar la sección correspondiente en AnteriorityUI.md.

## Regla: documentar cada modificación de componente

Toda vez que se agregue, cambie o elimine una prop (o cualquier comportamiento visible) de un componente en `screens/components/`, hay que actualizar en el mismo cambio la sección correspondiente en [AnteriorityUI.md](AnteriorityUI.md) (tabla de props, ejemplos de uso, notas) — no dejarlo para después. Si la sección del componente todavía no existe, crearla siguiendo el formato de las demás (Import / Uso básico / Props / Ejemplos / Notas). Si el cambio agrega o modifica variantes visuales relevantes, reflejarlo también en el `.stories.jsx` del componente (ver [Storybook](#storybook)).

## Dos componentes de avatar distintos

Hay dos implementaciones de avatar en el repo, ambas reales y en el barrel — no confundirlas:
- `screens/components/Avatar/` → avatar nativo standalone (sin MUI), con generación de color/inicial automática a partir de `name`. Expuesto en el barrel como `Avatar`. Lo consume `AvatarChip`.
- `screens/components/Profile/Avatar/` → el avatar usado dentro de `Sidebar`/`TopBar` para el menú de usuario. Expuesto en el barrel como `ProfileAvatar`.
