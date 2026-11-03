# Documento de prueba

Este archivo Markdown se usa en las stories de `MediaViewer` para probar el visor de `.md`.

## Texto con formato

Texto en **negrita**, *cursiva*, ~~tachado~~ y un [link de ejemplo](https://example.com).

> Una cita en bloque para ver cómo se renderiza el borde y el espaciado.

## Listas

- Elemento uno
- Elemento dos
  - Sub-elemento
- Elemento tres

1. Primer paso
2. Segundo paso
3. Tercer paso

- [x] Tarea completada
- [ ] Tarea pendiente

## Tabla

| Componente  | Estado     | Notas                  |
|-------------|------------|------------------------|
| AudioPlayer | Finalizado | Reproductor custom     |
| PdfViewer   | Finalizado | Render a canvas        |
| MarkdownViewer | Nuevo   | Usa `MarkdownContent`  |

## Código

```js
export function saludar(nombre) {
  return `Hola, ${nombre}!`;
}
```

---

Fin del documento.
