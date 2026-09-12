import SummaryCard from './index';

export default {
  title: 'Components/SummaryCard',
  component: SummaryCard,
};

export const Default = {
  args: {
    title: 'Resumen generado',
    text: 'Este es un resumen de ejemplo generado automáticamente a partir del contenido analizado, mostrando los puntos clave más relevantes.',
  },
};

export const WithCopyButton = {
  args: {
    title: 'Resumen con copia',
    text: 'Este resumen incluye un botón para copiar el contenido al portapapeles con un solo clic.',
    enableCopy: true,
  },
};

export const LongText = {
  args: {
    title: 'Resumen extenso',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    enableCopy: true,
  },
};
