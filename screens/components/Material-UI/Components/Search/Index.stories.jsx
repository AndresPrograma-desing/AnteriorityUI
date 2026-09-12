import React, { useState } from 'react';
import Search from './Index';

export default {
  title: 'Components/Material-UI/Search',
  component: Search,
};

const options = [
  { label: 'Ana Gomez', value: 1 },
  { label: 'Luis Perez', value: 2 },
  { label: 'Marta Ruiz', value: 3 },
];

export const WithOptions = {
  render: (args) => {
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    return (
      <Search
        {...args}
        value={value}
        onChange={setValue}
        inputValue={inputValue}
        onInputChange={setInputValue}
      />
    );
  },
  args: {
    options,
    label: 'Buscar usuario',
    placeholder: 'Escribe un nombre...',
  },
};

export const Loading = {
  render: (args) => {
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    return (
      <Search
        {...args}
        value={value}
        onChange={setValue}
        inputValue={inputValue}
        onInputChange={setInputValue}
      />
    );
  },
  args: {
    options: [],
    loading: true,
    label: 'Buscar usuario',
  },
};

export const FreeSolo = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <Search {...args} value={value} onChange={setValue} />;
  },
  args: {
    freeSolo: true,
    options: [],
    label: 'Buscar',
    placeholder: 'Escribe texto libre...',
  },
};
