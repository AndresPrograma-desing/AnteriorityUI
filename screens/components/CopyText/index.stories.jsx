import CopyableText from './index.jsx';

export default {
  title: 'Components/CopyText',
  component: CopyableText,
};

export const Default = {
  args: {
    text: 'ABC-12345-XYZ',
  },
};

export const Email = {
  args: {
    text: 'contacto@empresa.com',
  },
};

export const LongCode = {
  args: {
    text: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  },
};
