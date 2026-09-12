import React, { useState } from 'react';
import Paginador from './index';

export default {
  title: 'Components/Material-UI/Paginador',
  component: Paginador,
};

const ControlledTemplate = (args) => {
  const [page, setPage] = useState(args.page || 1);
  const [pageSize, setPageSize] = useState(args.pageSize);
  return (
    <Paginador
      {...args}
      page={page}
      onChange={(e, value) => setPage(value)}
      pageSize={pageSize}
      onPageSizeChange={args.onPageSizeChange && setPageSize}
    />
  );
};

export const Default = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    count: 10,
    page: 1,
  },
};

export const WithPageSizeSelector = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    count: 15,
    page: 2,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
    onPageSizeChange: () => {},
  },
};

export const Disabled = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    count: 10,
    page: 3,
    disabled: true,
  },
};
