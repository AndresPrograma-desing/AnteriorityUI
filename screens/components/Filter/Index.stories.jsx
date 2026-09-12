import Filter from './Index.jsx';
import TextField from '../Material-UI/Components/TextField/Index';

export default {
  title: 'Components/Filter',
  component: Filter,
};

export const Default = {
  args: {
    title: 'Filtros',
    onApply: () => console.log('applied'),
    onClear: () => console.log('cleared'),
    children: (
      <TextField label="Nombre" placeholder="Buscar por nombre" />
    ),
  },
};

export const WithActiveFiltersAndSearch = {
  args: {
    title: 'Filtros avanzados',
    activeFiltersCount: 3,
    searchTerm: 'reporte mensual',
    onApply: () => console.log('applied'),
    onClear: () => console.log('cleared'),
    children: (
      <>
        <TextField label="Nombre" placeholder="Buscar por nombre" />
        <TextField label="Estado" placeholder="Activo, inactivo..." />
      </>
    ),
  },
};

export const WidePanel = {
  args: {
    title: 'Filtros',
    width: '480px',
    onApply: () => console.log('applied'),
    onClear: () => console.log('cleared'),
    children: (
      <TextField label="Fecha desde" type="date" />
    ),
  },
};
