# AGENTS.md

Guía compartida para agentes de código que trabajen en `anteriority-ui`.

`CLAUDE.md` sigue siendo válido para Claude Code y conserva las reglas
específicas de ese entorno. Este archivo es la entrada equivalente para Codex
y otros agentes: no reemplaza `CLAUDE.md`; ambos deben mantenerse compatibles.

## Contexto del proyecto

Es una librería React de componentes reutilizables. La UI pública vive en
`screens/components/`; la lógica compartida en `common/`; la lógica de negocio
aislada en `features/` y `hooks/`. El barrel público es `index.js`.

Antes de crear UI, buscar primero un componente existente en el barrel y leer
la sección correspondiente de `AnteriorityUI.md`. No inventar props: si una
prop no aparece en la documentación ni en el código del componente, tratarla
como inexistente.

## Reglas de implementación

- Preservar cambios existentes y editar solo el alcance solicitado.
- Usar `apply_patch` para editar archivos.
- Mantener componentes visuales reutilizables y configurables por props.
- Los colores visibles deben seguir la convención `bgColor`, `textColor`,
  `iconColor`, `borderColor`, `accentColor` o un nombre específico del rol.
- Usar `ScrollBar` para scroll visible; no introducir barras nativas sin una
  razón documentada.
- Los imports internos relativos no llevan extensión.
- Si se agrega un componente público, actualizar `index.js`, su story y la
  documentación correspondiente.
- Todo cambio visible para consumidores se anota en `CHANGELOG.md` bajo
  "Sin publicar".
- No crear commits, ramas, PRs ni hacer cambios externos salvo que el usuario
  lo pida explícitamente.

## Skills y agentes compartidos

Los playbooks internos viven en `.claude/skills/` para Claude Code. Las entradas
descubribles por Codex están en `.agents/skills/` y enlazan esas mismas
instrucciones. Usar el que corresponda:

- `component-security-audit`: contenido externo, enlaces, HTML/Markdown, URLs,
  iframes, requests, storage o datos sensibles.
- `design-color-props`: componente visual nuevo o cambio de tematización.
- `expose-child-props`: un componente padre compone otros componentes y debe
  exponer sus configuraciones.
- `extract-shared-components`: UI o lógica repetida que conviene extraer.
- `native-scroll-audit`: cambios relacionados con scroll o viewport.

Para una revisión de seguridad completa, seguir el perfil neutral de
`agents/component-security-reviewer.md`. El perfil Claude equivalente en
`.claude/agents/` conserva su integración con Claude Code.

## Verificación obligatoria

No dar una tarea por terminada sin ejecutar las verificaciones aplicables y
reportar su resultado:

- Cambios en código de la librería: `pnpm build`.
- Cambios en stories o configuración de Storybook: `pnpm build-storybook`.
- Cambios con scroll: `pnpm check-scroll <ruta>`.
- Cambios con contenido externo o datos del usuario: `pnpm check-security <ruta>`.
- Cambios visuales: revisar la story en Storybook cuando sea posible.

No usar `pnpm test` como evidencia: es un placeholder que falla a propósito y
no hay suite unitaria configurada.

## Skill para consumidores

`skill/anteriority-ui/SKILL.md` es la guía que se publica junto con la librería
para que cualquier agente de código use correctamente sus componentes. No
duplica las tablas de props: la fuente de verdad es `AnteriorityUI.md` de la
versión instalada.
