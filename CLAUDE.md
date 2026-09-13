# CLAUDE.md

Guía para trabajar en este repo. Para documentación orientada a consumidores de la librería, ver [README.md](README.md) (instalación, setup, estructura) y [AnteriorityUI.md](AnteriorityUI.md) (props y ejemplos de uso de cada uno de los 50 componentes, en un único documento).

## Qué es este proyecto

`anteriority-ui` es una librería interna de componentes React, extraída originalmente del proyecto `vet-system-WEB` (en `C:\Users\Usuario\ProjectoUniversidad\vet-system-WEB`), con el objetivo de reutilizarla en otros proyectos. Los componentes viven en `screens/components/` y están construidos sobre MUI + CSS Modules + lucide-react.

## Estructura

```
screens/components/   → ~50 componentes de UI, uno por carpeta (index.jsx/Index.jsx + .module.css + .stories.jsx)
common/
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

La mayoría de los componentes con color propio (fondo, texto, ícono, borde) exponen props opcionales de color (`bgColor`, `textColor`, `iconColor`, `borderColor`, `accentColor`, o nombres específicos del rol cuando ninguno de esos encaja). Reglas al tocar o agregar componentes:

- **Todo prop de color es opcional y su default debe reproducir exactamente el color hardcodeado que existía antes** — es un cambio aditivo, nunca un rediseño.
- **Mecanismo:** si el color vive en el CSS module, se convierte a `var(--token-local, <valor-original>)` y el componente aplica `style={{ '--token-local': prop }}` solo cuando la prop viene definida (merge con cualquier `style` que el componente ya reciba). Esto funciona incluso para gradientes, `:hover` y contenido en portales (las CSS custom properties heredan).
- Si el color ya estaba inline en JSX (`style`, `sx`, `color=` de MUI), se reemplaza el literal por la prop con ese mismo valor como default de parámetro.
- **Los componentes con sistema `variant`/`type` (Barnner, DesplegablePanel, Notification/Error, TableB) mantienen su variant tal cual** — las props de color nuevas son un override opcional por encima de la paleta que resolvería el variant.
- Nombres reutilizados a propósito para consistencia entre componentes: `bgColor`, `textColor`, `iconColor`, `borderColor`, `accentColor`.

## Tipografía y theme

La fuente global es **Plus Jakarta Sans** (Google Fonts), no Roboto (default de MUI) ni el serif por default del navegador. Esto requiere DOS piezas trabajando juntas:
- `common/styles/typography.css` → importa la fuente y define `body { font-family: var(--font-sans) }` (arregla elementos HTML planos, ej. un `<h3>` sin clase).
- `common/theme/muiTheme.js` → `ThemeProvider` de MUI con `typography.fontFamily: 'var(--font-sans)'` (arregla componentes MUI, que si no, ignoran el `body` y usan su propio theme default).

Si se agrega un componente nuevo con texto visible, verificar que se vea con la fuente correcta en Storybook (`.storybook/preview.jsx` ya envuelve todas las stories en ambos).

## Comandos

```bash
pnpm storybook          # levanta Storybook en http://localhost:6006
pnpm build-storybook    # build estático de Storybook
pnpm build              # compila la librería a dist/ (scripts/build.mjs) — solo para probar el build, no hace falta para desarrollar
```

## Build y publicación (versionado real, npm público)

El paquete se publica en el registro público de npm como `anteriority-ui`, no vía `git+https://...` apuntando a `main` (ese instalaba el HEAD del branch sin versión ni changelog — ver [.github/workflows/publish.yml](.github/workflows/publish.yml)). Se eligió npm público en vez de GitHub Packages a propósito: GitHub Packages exige autenticación hasta para instalar (incluso en repos públicos), y la prioridad acá era que instalar fuera tan simple como `pnpm add mui` — sin `.npmrc` ni token del lado del consumidor. El costo es que el código queda visible públicamente en npm (el repo de GitHub puede seguir siendo privado).

- `scripts/build.mjs` transpila JSX → JS con esbuild (`jsx: 'automatic'`) y copia CSS Modules/otros assets, **preservando exactamente la misma estructura y capitalización de carpetas que el código fuente** (incluida la inconsistencia `index.jsx` vs `Index.jsx` por componente) para que los subpath imports documentados en README.md sigan resolviendo igual. También genera `dist/package.json` (subset de campos del `package.json` raíz — ver el script para la lista exacta) porque `publishConfig.directory: "dist"` en el `package.json` raíz le dice a `pnpm publish` que empaquete desde ahí, no desde la raíz del repo.
- El workflow se dispara con push de un tag `vX.Y.Z` y valida que coincida con la versión de `package.json` antes de publicar — ver la sección "Versionado y releases" en README.md para el flujo (`pnpm version patch/minor/major` + `git push --tags`).
- Si se agrega un componente/carpeta nueva bajo `screens/`, `common/`, `features/` o `hooks/`, no hace falta tocar nada del build — `scripts/build.mjs` recorre esos cuatro directorios dinámicamente.
- `react`, `react-dom`, `@mui/material`, `@emotion/*` ya son `peerDependencies` (no van empaquetados) — eso ya estaba bien resuelto antes de este cambio; lo que faltaba era el build + versionado, no las peer deps.

## ⚠️ Gotcha de pnpm workspace

`C:\Users\Usuario` (la carpeta home del usuario) es raíz de OTRO proyecto suyo no relacionado (`proyecto-hp-backend`, con su propio `package.json`/`pnpm-workspace.yaml`/`.git`). Como está dos niveles arriba de este repo, pnpm puede tratarlo como raíz del workspace y mezclar instalaciones ahí en vez de aislarlas acá. Por eso este repo tiene su propio `pnpm-workspace.yaml` (con `packages: []`) — **no lo borres** — sirve para que pnpm pare la búsqueda hacia arriba y trate `AnteriorityUI` como su propia raíz. Si algo similar vuelve a romperse (paquetes no encontrados en runtime pese a estar en `package.json`), sospechar primero de esto antes de reinstalar todo.

## Storybook

Cada componente en `screens/components/` tiene un `.stories.jsx` (formato CSF3) al lado de su implementación. Al agregar un componente nuevo, agregarle también su story con variantes reales (no placeholders) — son la referencia que se usa para escribir/actualizar la sección correspondiente en AnteriorityUI.md.

## Componentes sin implementar

`screens/components/Avatar/` (`index.jsx`, `utils.js`, `index.module.css`) son archivos vacíos (0 bytes) — un stub sin terminar, no lo usa nada del código. El avatar real y usado es `screens/components/Profile/Avatar/`. No confundir los dos ni documentar el stub hasta que tenga contenido real.
