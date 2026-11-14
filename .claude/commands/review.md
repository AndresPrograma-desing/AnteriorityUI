---
description: Revisa los cambios actuales (git diff/status) contra CLAUDE.md antes de commitear
argument-hint: [ruta o componente opcional para acotar la revisión]
---

Revisa los cambios actuales. Alcance opcional: $ARGUMENTS

**Solo lectura: no edites archivos ni hagas commit.** Informa y deja que el usuario decida qué corregir.

## Pasos

1. **Delimitar** con `git status` y `git diff` (más `git diff --staged`). Los archivos sin seguir (`??`) también cuentan. Si hay cambios que claramente son de otra tarea, sepáralos y dilo.
2. **Leer** el diff y los archivos completos de lo tocado, no solo los fragmentos cambiados.
3. **Revisar contra `CLAUDE.md`:**
   - Props de color con defaults que reproducen el color anterior; sub-componentes propagan las props.
   - Scroll con `ScrollBar`, no nativo.
   - Valores fijos en `constants.js`.
   - Imports relativos sin extensión y con el casing exacto de disco.
   - Componente nuevo: está en el barrel `index.js`, tiene story con variantes reales, sección en `AnteriorityUI.md` y entrada en `CHANGELOG.md`; si corresponde, el índice de `skill/anteriority-ui/SKILL.md`.
   - Duplicación que debería ser una pieza compartida.
4. **Revisar calidad y riesgos:**
   - **Rendimiento:** renders innecesarios, listeners/observers sin limpiar, trabajo pesado en render, imports pesados que deberían ser dinámicos.
   - **Seguridad:** XSS, `innerHTML`, protocolos de `href`/`src`, `target="_blank"` sin `rel`, `iframe` sin `sandbox`, secretos, logs con datos, storage. Corre `pnpm check-security` sobre los archivos tocados.
   - **Manejo de errores:** fallos silenciados sin motivo, estados de carga/error faltantes, el caso de `@rjsf/core` o dependencias opcionales ausentes.
   - **Deuda técnica:** código muerto, `console.log` de depuración, TODOs, lógica duplicada, componentes que crecieron sin descomponerse.
   - **Accesibilidad básica:** roles, `aria-label` en botones de solo ícono, foco, contraste con las props de color.
5. **Verificar que compila:** corre `pnpm build` (y `check-scroll`/`check-security` si aplican). Reporta la salida real; si no corriste algo, dilo.

## Informe

En español y breve:
- **Alcance:** archivos revisados y comandos corridos con su resultado.
- **Bloqueantes** (impiden commitear), **Importantes** y **Menores**, cada uno con `archivo:línea`, el problema y la corrección sugerida.
- **Fuera de alcance / cambios ajenos** detectados.
- **Veredicto:** listo para commitear, o qué falta. No inventes hallazgos para que el informe parezca completo.

Recuerda al final la convención de commit: rama `<tipo>/UI-<n>-<slug>`, asunto `UI-<n>: ...` en inglés, sin PRs.
