import React from 'react';
import Table from '../Table/index';

// Wrapper de compatibilidad: TableA es Table con variant="A". Se mantiene con su API y look
// originales para los consumidores que ya la importan por separado.
/**
 * @deprecated Legacy: usar `<Table variant="A" />`. Se mantiene solo por compatibilidad.
 */
const TableA = (props) => <Table {...props} variant="A" />;

export default TableA;
