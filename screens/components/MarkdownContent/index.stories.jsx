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

export const WithImage = {
  args: {
    children:
      '# Captura de pantalla\n\n![Logo de ejemplo](https://via.placeholder.com/320x120.png?text=Imagen+de+ejemplo)\n\nLas imágenes usan la sintaxis estándar de markdown: `![alt](url)`.',
  },
};

export const WithColoredText = {
  args: {
    children:
      'Este párrafo tiene {color:#ef4444}texto en rojo{/color}, {color:#16a34a}texto en verde{/color} y {color:#2563eb}texto en azul{/color} usando la sintaxis `{color:X}texto{/color}`.\n\nTambién funciona dentro de **negrita con {color:#d97706}color adentro{/color}**.',
  },
};

export const WithCopyableText = {
  args: {
    children:
      'Pasa el mouse sobre el texto para ver el botón de copiar.\n\nEl correo de soporte es {copy}soporte@ejemplo.com{/copy} y la IP del servidor es {copy}192.168.1.1{/copy}.\n\nEsto no afecta a los demás copiables: el título y el bloque de código de abajo siguen funcionando igual.\n\n# Título copiable\n\n```js\nconst apiKey = "abc123";\n```',
  },
};

export const WithCopyableBlock = {
  args: {
    children:
      '{copy}# Colocar un Storage al Paginador\n\n## Objetivo\n\nEvitar que al entrar a un detalle y volver, el paginador se reinicie a la página 1.\n\n### Guardar la página\n\n```javascript\nconst handlePageChange = (newPage) => {\n  setPage(newPage);\n  localStorage.setItem(\'currentPage\', newPage);\n};\n```\n\n### Leer la página al iniciar\n\n```javascript\nconst [page, setPage] = useState(() => {\n  const saved = localStorage.getItem(\'currentPage\');\n  return saved ? Number(saved) : 1;\n});\n```\n{/copy}\n\nEste texto queda afuera del bloque copiable.',
  },
};

export const WithBarePastedImageUrl = {
  args: {
    children:
      '# Imagen pegada directa\n\nSi pegás una URL sola en su propia línea (sin escribir `![alt](url)`), se muestra como imagen automáticamente — útil para URLs de Google Images u otros servicios que no terminan en `.png`/`.jpg`.\n\nhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFvLKiCCYeL-dqH4i8rEAHVcLw9aMIxp3qFmMk-CMDjg&s=10',
  },
};
