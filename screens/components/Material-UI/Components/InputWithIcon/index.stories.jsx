import React, { useState } from 'react';
import { Mail, Search as SearchIcon, User } from 'lucide-react';
import InputWithIcon from './index';

export default {
  title: 'Components/Material-UI/InputWithIcon',
  component: InputWithIcon,
};

const ControlledTemplate = (args) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <InputWithIcon
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Outlined = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Correo electrónico',
    placeholder: 'usuario@correo.com',
    icon: Mail,
    variant: 'outlined',
  },
};

export const Standard = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Usuario',
    placeholder: 'Escribe tu nombre...',
    icon: User,
    variant: 'standard',
  },
};

export const Row = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Buscar',
    placeholder: 'Buscar...',
    icon: SearchIcon,
    variant: 'row',
  },
};
