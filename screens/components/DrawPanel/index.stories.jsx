import DrawPanel from './index.jsx';

export default {
  title: 'Components/DrawPanel',
  component: DrawPanel,
};

export const Default = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    title: 'Detalle del registro',
    description: 'Revisa la información antes de continuar',
    width: '420px',
    children: (
      <p style={{ margin: 0 }}>Contenido del panel lateral.</p>
    ),
  },
};

export const WithActions = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    onConfirm: () => console.log('confirmed'),
    title: 'Confirmar acción',
    description: 'Esta acción no se puede deshacer',
    descriptionPosition: 'bottom',
    showActions: true,
    confirmText: 'Guardar',
    cancelText: 'Cancelar',
    width: '400px',
    children: (
      <p style={{ margin: 0 }}>Formulario o resumen de la acción a confirmar.</p>
    ),
  },
};

export const WithCountdownSelectionProgress = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    title: 'Selecciona elementos',
    width: '420px',
    showCountdown: true,
    progressMode: 'selection',
    totalItems: ['a', 'b', 'c', 'd'],
    selectedItems: ['a', 'b'],
    children: (
      <p style={{ margin: 0 }}>2 de 4 elementos seleccionados.</p>
    ),
  },
};

export const TopAnchor = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    title: 'Aviso',
    anchor: 'top',
    width: '480px',
    children: (
      <p style={{ margin: 0 }}>Panel anclado en la parte superior de la pantalla.</p>
    ),
  },
};
