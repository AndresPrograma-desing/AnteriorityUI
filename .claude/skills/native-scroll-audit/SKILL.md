---
name: native-scroll-audit
description: Detecta y corrige scroll NATIVO del navegador (barra gris/flechas del sistema) en componentes de AnteriorityUI, que debe ser siempre el ScrollBar de la librería. Cubre `overflow: auto|scroll` en CSS/inline/sx y superficies de MUI (Menu, Dialog, Popover, Popper, Select, Autocomplete) que scrollean solas cuando el contenido no entra. Usar cuando se crea o toca un componente con listas, menús, diálogos, paneles o tablas, cuando el usuario reporta "doble scroll", "scroll feo/gris" o "que sea el scroll de la librería", o antes de dar por terminado un componente que puede desbordar.
---

# Native scroll audit (AnteriorityUI)

La librería tiene su propio `ScrollBar` (`screens/components/ScrollBar/`, track/thumb estilizados con auto-hide).
El scroll nativo del navegador (barra gris con flechas) rompe la identidad visual y ya apareció **varias veces**:
el menú contextual del visor de planillas, el diálogo «Validar datos», la barra de página de `AppShell`…
Siempre por el mismo motivo: un contenedor que desborda y hereda `overflow: auto` nativo (propio o de MUI).

## Cuándo usarla
- Se crea/edita un componente con lista, menú, diálogo, popover, drawer, tabla o panel que puede crecer.
- El usuario menciona doble scroll, scroll nativo/gris, o que "debería ser el scroll de la librería".
- Antes de cerrar cualquier cambio que agregue contenido a una superficie con alto limitado.

## Proceso
1. **Correr el auditor:** `pnpm check-scroll` (o `node scripts/check-native-scroll.mjs <ruta-del-componente>`).
   Marca `overflow(-x|-y): auto|scroll` en CSS/JSX y archivos que usan superficies de MUI sin `ScrollBar`.
   El baseline del repo tiene hallazgos viejos: **no ampliarlo**; revisar solo lo que se tocó.
2. **Clasificar cada hallazgo:**
   - *Es un scroll visible al usuario* (lista, cuerpo de un panel/diálogo, menú) → reemplazar por `ScrollBar`.
   - *No es scroll de usuario* (`overflow: auto` para recortar, `overflow-x` de un `<pre>`/tabla markdown que casi nunca desborda, `Resizable` interno) → dejar y marcar con un comentario `native-scroll-ok: <motivo>` en el archivo.
3. **Aplicar `ScrollBar`** según el caso:
   - *Contenedor propio:* `<ScrollBar maxHeight="..." horizontal={false}>…contenido…</ScrollBar>`; sacar `overflow: auto` del CSS del contenedor (queda `overflow: hidden` si hace falta).
   - *`Menu` de MUI:* `slots={{ list: ScrollableMenuList }}` donde `ScrollableMenuList = forwardRef((props, ref) => <ScrollBar maxHeight="calc(100vh - 48px)" horizontal={false}><MenuList {...props} ref={ref} /></ScrollBar>)`, y en `slotProps.paper.style`: `overflow: 'hidden'` + `maxHeight`. Referencia: `MediaViewer/components/XlsxViewer/components/XlsxContextMenu/`.
   - *`Dialog` de MUI:* `<DialogContent sx={{ overflow: 'hidden', p: 0 }}><ScrollBar maxHeight="calc(100vh - 220px)" horizontal={false}><div style={{ padding }}>…</div></ScrollBar></DialogContent>`.
   - *`Popover`/`Popper`/`Select`/`Autocomplete`:* el listado va dentro de un `ScrollBar` con `maxHeight` (en `Select`: `MenuProps.slots.list` como en `Menu`; en `Autocomplete`: `slots.listbox`).
   - *Página completa:* si el layout ocupa `100vh` (ej. `AppShell`), nada debe superar ese alto: sumar paddings/bordes al cálculo, no dejar que la página gane su propio scroll.
4. **Verificar de verdad (no solo leer el código):** abrir la story en un viewport bajo (≈ 420–520 px de alto) y comprobar por consola, con la skill `browser-automation`:
   - el nodo MUI no scrollea nativamente: `el.scrollHeight > el.clientHeight` en `false`;
   - existe un `[class*="thumbVertical"]` dentro (el thumb del ScrollBar de la librería);
   - la superficie cabe en pantalla: `getBoundingClientRect().bottom <= innerHeight`;
   - `document.documentElement.scrollHeight <= innerHeight` (la página no gana scroll propio).
5. **Cerrar:** `pnpm check-scroll <ruta>` sin hallazgos nuevos y `pnpm build` en verde. Si el componente tiene doc, mencionar en `AnteriorityUI.md` que scrollea con `ScrollBar`.

## Qué NO hacer
- No usar `scrollbar-width`/`::-webkit-scrollbar` para "maquillar" la barra nativa: el criterio es usar el componente de la librería.
- No quitar `overflow` de un contenedor sin darle otra salida al contenido: va a recortarse.
- No tocar el `ScrollBar` mismo para resolver un caso puntual; si hay un bug del componente (ej. thumb mal dimensionado), se arregla ahí y se prueba en todos los usos.
- No ampliar el baseline de `pnpm check-scroll` con excepciones sin motivo.
