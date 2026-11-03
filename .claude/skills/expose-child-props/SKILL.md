---
name: expose-child-props
description: Audita un componente de AnteriorityUI que renderiza otros componentes de la librería (ej. ChatComposer usa MultilinePlaceholder e ImagePastePreview) y verifica que el padre exponga las props de esos hijos que el consumidor necesita configurar, reenviándolas al hijo. Usar cuando se crea o modifica un componente que compone otros, cuando el usuario pide que un padre sea "totalmente personalizable" o que "se pueda pasar la prop al otro componente", o cuando se sospecha que una prop del hijo queda inaccesible desde el padre.
---

# Expose child props (AnteriorityUI)

Esta skill existe porque un componente padre que usa un hijo de la librería
suele quedar a medio configurar: el consumidor del padre no puede tocar props
del hijo que sí existen (tamaño, etiquetas, colores, variantes), y se descubre
recién cuando alguien pide "¿se puede cambiar X desde afuera?". Pasó con
`ChatComposer`: el preview de imágenes tenía `style` y props propias que el
composer no reenviaba; también faltaban colores del menú y del placeholder
hasta que se auditó a mano.

El objetivo es que, por cada hijo usado dentro de un padre, quede claro qué
props del hijo son configurables desde el padre y cuáles son internas.

## Cuándo usarla

- Se crea un componente que renderiza uno o más componentes de `screens/components/`.
- El usuario pide que un padre sea "personalizable", "configurable" o que
  "se le pueda pasar la prop al otro componente".
- Se modifica un hijo (se agregan props) y hay que decidir si el padre las expone.
- Un padre pasa un `...props` o una lista fija de props y se sospecha que
  descarta silenciosamente otras.

## Proceso

1. **Inventariar los hijos usados por el padre.** Buscar los imports de la
   librería dentro del padre y de sus sub-componentes internos:
   ```bash
   grep -rn "from '\.\./" screens/components/<Padre>/
   ```
   Ignorar `common/` y los imports internos del propio padre (sus
   `constants.js`, `utils.js`, sub-componentes en `components/`), salvo que
   esos sub-componentes a su vez rendericen un componente de la librería.

2. **Leer la superficie de props de cada hijo.** Mirar la firma del
   componente hijo (destructuring en su `index.jsx`) y su `constants.js`.
   Anotar cada prop con: nombre, tipo, default, y si es de color.

3. **Ver qué le pasa el padre hoy.** Para cada hijo, listar las props que el
   padre ya le pasa explícitamente y cuáles reenvía (un `...rest` o un
   `xProps` spread). Lo que no aparece en ninguna de las dos listas es una
   laguna.

4. **Clasificar cada prop del hijo que no está expuesta:**
   - **Interna, no exponer:** la que el padre necesita controlar para que
     funcione (ej. `value`/`onChange` cuando el padre maneja el estado,
     `ref`, `children`, handlers de eventos que el padre ya usa, `id`
     generado). Si el consumidor la pisara, rompe el padre.
   - **Configurable, exponer:** colores, etiquetas (textos), tamaños,
     variantes, placeholders, flags de comportamiento que no contradicen al
     padre. Estas son las que hay que llevar hasta el consumidor.
   - **Dudosa:** preguntar al usuario antes de exponer, si cambia el
     comportamiento del padre.

5. **Exponer en el padre con dos niveles, como ya hace el repo:**
   - **Props nombradas** para las más usadas o que el padre ya maneja
     (ej. `imagePreviewLabel`, `imagePreviewBorderColor`), con default
     `undefined` cuando el hijo ya tiene su propio default. Así no se
     duplica el valor por default en dos lugares.
   - **Un objeto passthrough** `<nombreHijo>Props` (ej. `markdownProps`,
     `imagePreviewProps`, `schemaFormProps`) para todo lo demás, spread
     **al final** del JSX del hijo, para que cualquier prop del hijo llegue
     aunque el padre no la haya nombrado. Si el objeto trae una clave que
     también está nombrada, gana el objeto (documentarlo).
   - Reenviar sin cambiar la semántica: no reinterpretar ni renombrar el
     valor en el padre salvo que sea una conversión explícita y documentada.

6. **Colores:** si el hijo tiene props de color, aplicar también la skill
   `design-color-props`. Un color del hijo que el padre no expone deja la
   paleta a medio personalizar.

7. **Props que el padre usa internamente:** si el padre agrega un prop propio
   con el mismo nombre que uno del hijo, elegir uno y documentar la
   diferencia. No dejar dos props con el mismo nombre y significados distintos.

8. **Actualizar `AnteriorityUI.md`:** en la tabla de props del padre, agregar
   las props nombradas nuevas y el objeto passthrough, con una nota de qué
   hijo recibe las props reenviadas. Esto es obligatorio por CLAUDE.md.

9. **Actualizar el `.stories.jsx`** del padre con una variante que use al
   menos una prop reenviada (ej. una prop del hijo que antes no se podía
   tocar desde el padre), no un placeholder.

10. **Validar:** `pnpm check-case` y `pnpm build` deben pasar. Para el
    editor, revisar que no queden props declaradas sin usar (`declared but
    never read`) — suele indicar una prop que se agregó al destructuring pero
    nunca se reenvió al hijo.

## Qué NO hacer

- No reenviar `value`/`onChange` ni `children` del hijo si el padre ya los
  maneja: el consumidor no debe poder desincronizar el estado del padre.
- No exponer una prop solo porque existe. Exponer lo que el consumidor
  necesita configurar, no todo el hijo.
- No copiar el default del hijo al padre como valor fijo: si el hijo cambia
  su default, el padre quedaría con el valor viejo. Dejar `undefined` y que
  el hijo resuelva.
- No usar un `...props` sin documentar: el consumidor no sabe qué pasa con
  las props que llegan al padre. Preferir el objeto `<hijo>Props` explícito.
- No asumir que el padre ya expone todo porque "pasa los props": confirmar
  con la lista del paso 3.

## Ejemplo del repo

`ChatComposer` renderiza `MultilinePlaceholder`, `ImagePastePreview`,
`MarkdownContent`, `Button` y `ComposerToolbar`:
- `MultilinePlaceholder`: el composer reenvía `placeholder`, `rows`,
  `maxRows`, `disabled` y `inputBgColor`. Su `showImagePreview` lo fija en
  `false` a propósito, porque el preview de imágenes se muestra arriba.
- `ImagePastePreview`: props nombradas `imagePreviewLabel`,
  `imagePreviewBorderColor`, etc., más `imagePreviewProps` para el resto.
- `MarkdownContent`: `markdownProps` como passthrough.

Un hallazgo típico de esta skill en ese componente: el preview de imágenes
tenía `style` sin reenviar hasta que se agregó `imagePreviewProps`.
