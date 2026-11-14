---
name: component-security-audit
description: Audita la seguridad de los componentes de AnteriorityUI (XSS, inyección de HTML, ejecución de código, secretos hardcodeados, fugas por consola/storage/errores, enlaces y iframes sin aislar, transporte inseguro, postMessage abierto). Usar cuando se crea o toca un componente que renderiza contenido externo o del usuario (markdown, HTML, SVG, iframes, enlaces, visores de archivos), que hace requests o maneja datos personales o tokens, cuando el usuario pide revisar seguridad, fugas o "que no tenga vulnerabilidades", o antes de cerrar un release.
---

# Component security audit (AnteriorityUI)

La librería la consume otra aplicación: cualquier fallo de seguridad en un componente se hereda en todos los proyectos que la instalan.
Esta skill combina un auditor estático (`scripts/check-security.mjs`) con una revisión manual de lo que el análisis estático no ve.

## Cuándo usarla
- Se crea o modifica un componente que renderiza contenido que no escribió el desarrollador (texto de usuario, markdown, HTML, SVG, nombres de archivo, URLs).
- El componente abre enlaces, `window.open`, `iframe`, visores de PDF/DOCX/XLSX o diagramas.
- El componente hace requests, maneja tokens/contraseñas/datos personales o escribe en `localStorage`/`sessionStorage`.
- El usuario pide revisar seguridad, fugas, XSS, o "que no tenga vulnerabilidades".
- Antes de un release (`pnpm build` + esta skill sobre los componentes tocados).

## Proceso
1. **Correr el auditor:** `pnpm check-security` (o `node scripts/check-security.mjs <ruta>`).
   Informa hallazgos por severidad (`high`, `medium`, `low`). Sale en 0 salvo con `--strict` (falla si hay `high`).
   Solo revisar lo que se tocó; no aceptar hallazgos nuevos.
2. **Clasificar cada hallazgo:**
   - *Riesgo real* → corregir (ver recetas abajo).
   - *Falso positivo* (ej. un `innerHTML` de una salida ya sanitizada, un `iframe` de un recurso propio) → dejar y marcar con `security-ok: <motivo concreto>` en la línea o en la anterior. El motivo debe explicar por qué es seguro, no solo "es falso positivo".
3. **Revisión manual** (el auditor no la cubre):
   - ¿Algún `href`/`src` viene de datos externos? Debe filtrarse el protocolo: bloquear `javascript:`, `data:` que no sea imagen, `vbscript:`.
   - ¿Markdown/HTML del consumidor pasa por `rehype-raw` o `allowDangerousHtml`? No debe; el HTML queda escapado.
   - ¿Se muestran mensajes de error del servidor o `err.stack` al usuario? Solo mensajes controlados.
   - ¿Se loguea algo con datos personales o tokens (aunque sea en `console.warn`)?
   - ¿Los props que el consumidor pasa se usan como clase CSS, nombre de atributo o `style` sin validar? Un valor malicioso no debe poder romper el layout ni inyectar atributos.
   - ¿Un `iframe`, `object` o `embed` recibe una URL del usuario? Debe tener `sandbox` restrictivo y, si es posible, allowlist de orígenes.
   - ¿La librería hace `fetch` a un origen fijo o al que configura el consumidor? No debe enviar credenciales a hosts hardcodeados.
4. **Recetas de corrección:**
   - *Contenido HTML/SVG generado por una librería* (ej. Mermaid): usar la configuración estricta de la librería (`securityLevel: 'strict'`) y documentar en `security-ok` por qué la inyección es segura.
   - *HTML del usuario:* no inyectarlo. Si hace falta, sanitizar con una librería como DOMPurify (dependencia opcional, cargada con import dinámico como `SchemaFormLoader`).
   - *Enlaces externos:* `target="_blank"` siempre con `rel="noopener noreferrer"`; `window.open(url, '_blank', 'noopener,noreferrer')`.
   - *iframe:* `sandbox` con el mínimo de permisos (`sandbox="allow-scripts allow-same-origin"` solo si es necesario y el origen es confiable).
   - *Logs:* quitar `console.log`/`debug` de código de librería. `console.warn`/`console.error` solo con mensajes sin datos del usuario.
   - *Secretos:* nunca en el código. Los tokens llegan por `configureApiClient({ getAuthToken })` (ver `common/api/client.js`).
   - *Storage:* no guardar tokens ni contraseñas en `localStorage`; solo preferencias de UI.
   - *URLs:* `https://` siempre. `http://` solo para `localhost`.
5. **Verificar:**
   - `pnpm check-security --strict` sin `high`.
   - `pnpm check-security <ruta>` sin hallazgos nuevos en los archivos tocados.
   - `pnpm build` en verde.
   - Si se cambió un render de contenido externo, probar en Storybook con un payload de prueba (`<img src=x onerror=alert(1)>`, `[x](javascript:alert(1))`) y confirmar que no se ejecuta (usar `browser-automation`).
6. **Documentar:** si el cambio altera comportamiento visible o seguridad (ej. un enlace que ahora se bloquea), anotarlo en `CHANGELOG.md` (sección "Sin publicar", en español, desde el punto de vista del consumidor).

## Qué NO hacer
- No desactivar un chequeo del auditor para que pase el build; si es falso positivo, `security-ok` con motivo.
- No "sanitizar" con regex propias: usar un parser o una lista de protocolos permitidos.
- No confiar en que el consumidor sanitiza: la librería debe ser segura con los datos que le llegan.
- No ampliar la lista de excepciones sin motivo concreto.
