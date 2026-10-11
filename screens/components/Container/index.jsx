import React from 'react';
import styles from './index.module.css';
import Paginador from '../Material-UI/Components/Paginador';
import Barnner from '../Barnner';

export default function Container({ 
  wattermark = true,
  children, 
  className = '', 
  borderColor,
  showPagination = false,
  paginationCount = 10,
  paginationPage = 1,
  onPaginationChange,
  paginationProps = {},
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
  style,
  ...props 
}) {
  const containerStyle = {
    ...(borderColor ? { '--container-border': borderColor } : {}),
    ...style,
  };

  return (
    <div
      className={`${styles.containerCard} ${className}`}
      style={Object.keys(containerStyle).length ? containerStyle : undefined}
      {...props}
    >

      {wattermark && 
      <Barnner 
      bgColor="#e1ddecff"
      
      >Desarrollado por AnteriorityUI</Barnner>}
      {children}
      {showPagination && (
        <div className={styles.paginationContainer}>
          <Paginador 
            count={paginationCount} 
            page={paginationPage} 
            onChange={onPaginationChange} 
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageSizeChange={onPageSizeChange}
            {...paginationProps}
          />
        </div>
      )}
    </div>
  );
}
