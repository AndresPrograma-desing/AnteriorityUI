import React from 'react';
import Table from '../Table/index';

// Wrapper de compatibilidad: TableB es Table con variant="B". Se mantiene con su API y look
// originales para los consumidores que ya la importan por separado.
const TableB = (props) => <Table {...props} variant="B" />;

export default TableB;
