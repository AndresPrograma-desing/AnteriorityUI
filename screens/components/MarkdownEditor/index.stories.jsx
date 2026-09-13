import { useState } from 'react';
import { MarkdownEditor } from './Index';

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
