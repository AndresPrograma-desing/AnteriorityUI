import GreenHighlight from './Index.jsx';

export default {
  title: 'Components/GreenHighlight',
  component: GreenHighlight,
};

export const Default = {
  args: {
    children: 'texto destacado',
  },
};

export const InSentence = {
  render: () => (
    <p>
      El pedido fue <GreenHighlight>aprobado exitosamente</GreenHighlight> y está listo para su envío.
    </p>
  ),
};

export const Number = {
  args: {
    children: '$1,250.00',
  },
};
