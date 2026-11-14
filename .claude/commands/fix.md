---
description: Diagnostica y corrige errores en bucle hasta que build y chequeos pasen en verde
argument-hint: [error, comando que falla o descripción; vacío = correr pnpm build]
---

Diagnostica y corrige: $ARGUMENTS

Si no se indicó un error o comando, parte de `pnpm build`.

## Bucle

1. **Ejecutar** el comando que falla (por defecto `pnpm build`; puede ser `pnpm check-case`, `pnpm build-storybook`, `pnpm check-scroll`, `pnpm check-security --strict`). Guarda la salida completa.
2. **Leer la salida completa**, no solo la última línea: el primer error suele ser la causa y los siguientes, consecuencia. Si hay un stack trace, léelo entero.
3. **Encontrar la causa raíz.** Lee los archivos implicados. No parchees el síntoma ni silencies el error (nada de `// @ts-ignore`, `catch {}` vacío, desactivar un chequeo o agregar `security-ok` para que pase). Casos conocidos de este repo:
   - Import con extensión `.jsx` o con mayúsculas/minúsculas distintas al archivo en disco: rompe `verify-dist`/`check-case` aunque Storybook funcione. Ver "Build y publicación" en `CLAUDE.md`.
   - Un rename solo de casing en Windows que no se aplicó físicamente tras un checkout.
   - Dependencias que no resuelven por el gotcha de pnpm workspace (no borrar `pnpm-workspace.yaml`).
4. **Corregir** con el cambio mínimo que ataca la causa, respetando `CLAUDE.md`.
5. **Volver a ejecutar** el mismo comando. Si pasa, corre además los chequeos que apliquen a lo tocado (`pnpm build` completo, `check-scroll`, `check-security`).
6. **Repetir** hasta que todo esté en verde. Si el mismo error reaparece tras dos intentos, detente, replantea la hipótesis y no repitas el mismo arreglo.

## Cuándo parar

- Si la causa está fuera de lo que puedes cambiar (credenciales, servicio externo, decisión de diseño que solo el usuario puede tomar), deja de iterar y reporta: qué descartaste, qué evidencia hay y qué haría falta para resolverlo.
- No hagas commit ni push; no toques cambios ajenos al error.

## Reporte final

Resume la causa raíz, qué se cambió y el resultado real de los comandos finales. Si algo no pasa o no se pudo correr, dilo primero.
