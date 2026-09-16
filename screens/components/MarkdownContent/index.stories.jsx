import { MarkdownContent } from './index';

export default {
  title: 'Components/MarkdownContent',
  component: MarkdownContent,
};

export const Default = {
  args: {
    children: '# Heading\n\nThis is a **bold** paragraph with some *italic* text and a [link](https://example.com).',
  },
};

export const WithList = {
  args: {
    children: '## Features\n\n- First item\n- Second item\n- Third item\n\n1. Ordered one\n2. Ordered two',
  },
};

export const WithTable = {
  args: {
    children: '| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Data 1 | Data 2 | Data 3 |\n| Data 4 | Data 5 | Data 6 |',
  },
};

export const WithCodeBlock = {
  args: {
    children: '```js\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```',
  },
};

export const WithCopyableTitleAndCode = {
  args: {
    children:
      '# Guía rápida\n\nPasa el mouse sobre el título para ver el botón de copiar, y sobre el bloque de código para copiarlo completo.\n\n```js\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));\n```',
  },
};
