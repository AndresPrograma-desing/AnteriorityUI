---
description: Ejecuta un plan aprobado de forma incremental, verificando al terminar cada bloque
argument-hint: [plan o referencia al plan aprobado; vacío = el último plan de la conversación]
---

Ejecuta el plan aprobado: $ARGUMENTS

Si no hay un plan aprobado en la conversación, no inventes uno: pide al usuario que corra `/plan` primero.

## Reglas

- Respeta `CLAUDE.md` en cada archivo que toques (props de color, `ScrollBar`, `constants.js`, imports relativos **sin extensión**, descomposición, barrel, tipografía). El plan no te exime de esas reglas.
- Haz los cambios **por bloques pequeños** en el orden del plan. No mezcles tareas ajenas al plan; si encuentras algo fuera de alcance, anótalo al final en vez de corregirlo.
- Usa Edit sobre archivos existentes. No toques cambios sin commitear que no sean de esta tarea (el árbol puede tener trabajo del usuario en curso).

## Después de cada bloque

1. Corre `pnpm build`. Si el bloque tocó stories o Storybook, también `pnpm build-storybook`.
2. Si el bloque toca scroll, listas, menús o diálogos: `pnpm check-scroll <ruta>`.
3. Si el bloque renderiza contenido externo, enlaces, iframes, requests o storage: `pnpm check-security <ruta>`.
4. Si falla algo, **no sigas al siguiente bloque**: corrige la causa (ver `/fix`) y repite hasta que pase.

## Al terminar

1. Actualiza la documentación del mismo cambio: `AnteriorityUI.md`, `CHANGELOG.md` (sección "Sin publicar") y la story del componente, si el cambio es visible para quien consume la librería. Si el componente es público, verifica el barrel `index.js` y la skill `skill/anteriority-ui/SKILL.md` según `CLAUDE.md`.
2. Si hay un componente visual nuevo, aplica la skill `design-color-props`.
3. Corre la verificación final completa de "Definición de terminado" y reporta la salida real de cada comando.
4. Informa qué se hizo, qué decisiones se tomaron, y qué quedó fuera. **Nunca declares la tarea terminada si un comando falló o no se ejecutó**; dilo explícitamente.
5. No hagas commit ni push salvo que el usuario lo pida. Si lo pide: rama `<tipo>/UI-<n>-<slug>`, asunto `UI-<n>: ...` en inglés, y sin PRs.
