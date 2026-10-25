import { useState } from 'react';
import { MarkdownEditor } from './index';

export default {
  title: 'Components/MarkdownEditor',
  component: MarkdownEditor,
};

const EditorWithState = (args) => {
  const [value, setValue] = useState(args.value ?? '');
  return (
    <MarkdownEditor
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      
    />
  );
};

export const Default = {
  render: (args) => <EditorWithState {...args} />,
  args: {
    value: '# Hello world\n\nStart writing **markdown** here.',
    placeholder: 'Write your markdown here...',
    defaultHeight: 320,
  },
};

export const Empty = {
  render: (args) => <EditorWithState {...args} />,
  args: {
    value: '',
    placeholder: 'Type something...',
    defaultHeight: 260,
  },
};

export const WithCodeBlock = {
  render: (args) => <EditorWithState {...args} />,
  args: {
    value:
      '# Título del snippet\n\nHaz click en el ícono de copiar del título o del bloque para copiarlos rápido.\n\n```js\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));\n```',
    placeholder: 'Write your markdown here...',
    defaultHeight: 380,
  },
};

export const WithImageAndColor = {
  render: (args) => <EditorWithState {...args} />,
  args: {
    value:
      '# Demo de imagen y color\n\nUsa el ícono de imagen de la toolbar para insertar `![alt](url)`, y el ícono de paleta para abrir el selector de color y envolver el texto seleccionado en `{color:X}texto{/color}`.\n\n{color:#ef4444}Este texto ya está en rojo{/color} como ejemplo.\n\n![Imagen de ejemplo](https://via.placeholder.com/300x100.png?text=Ejemplo)',
    placeholder: 'Write your markdown here...',
    defaultHeight: 420,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demuestra los botones de imagen (icono de imagen) y color (icono de paleta, abre un ColorPicker con botón "Aplicar") agregados a la toolbar.',
      },
    },
  },
};

export const WithCopyableText = {
  render: (args) => <EditorWithState {...args} />,
  args: {
    value:
      'Usa el ícono de clip (copiar) de la toolbar para envolver el texto seleccionado en `{copy}texto{/copy}` — en la vista previa aparece con un botón de copiar al lado, sin afectar el copy de títulos o bloques de código.\n\nEjemplo ya escrito: el correo {copy}soporte@ejemplo.com{/copy} es copiable.',
    placeholder: 'Write your markdown here...',
    defaultHeight: 380,
  },
};

export const CustomLabels = {
  render: (args) => <EditorWithState {...args} />,
  args: {
    value: '## Título\n\nContenido de ejemplo con **negrita**.',
    placeholder: 'Escribe aquí...',
    defaultHeight: 320,
    labels: {
      editorTab: 'Editar',
      splitTab: 'Dividido',
      previewTab: 'Vista previa',
    },
  },
};

export const WithCustomScrollbar = {
  render: (args) => <EditorWithState {...args} />,
  args: {
    value: Array.from({ length: 30 }, (_, i) => `Línea ${i + 1} de contenido de ejemplo.`).join('\n\n'),
    placeholder: 'Write your markdown here...',
    defaultHeight: 220,
    scrollbarColor: '#38bdf8',
  },
};
