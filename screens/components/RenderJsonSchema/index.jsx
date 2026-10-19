import React from 'react';
import MediaViewer from '../MediaViewer/index';
import styles from './index.module.css';
import { DEFAULT_EMPTY_TEXT } from './constants.js';
import { formatPrimitiveValue } from './utils.js';

// Vista de solo lectura de datos ya guardados a partir de un JSON Schema: no
// es un formulario (no usa rjsf ni ningún widget editable de SchemaForm), solo
// recorre schema.properties y muestra cada valor de `formData` como texto/
// imagen, con el label (`title`) y el formato (enum/boolean/date/data-url) que
// el propio schema ya describe. Pensado para mostrar una respuesta ya enviada
// (ej. el detalle de un envío hecho con <SchemaForm />) sin repetir a mano el
// mapeo de cada campo.
//
// Tolera datos viejos guardados por un widget roto (valores que no matchean
// el tipo esperado por el schema): en vez de romper o mostrar "[object Object]",
// esos campos se muestran como vacíos.
function getDataURLs(rawValue) {
  const values = Array.isArray(rawValue) ? rawValue : [rawValue];
  return values.filter((v) => typeof v === 'string' && v.startsWith('data:'));
}

function FileValue({ rawValue, mediaColors }) {
  const files = getDataURLs(rawValue);
  return (
    <div className={styles.fileList}>
      {files.map((dataURL, index) => (
        <MediaViewer key={index} url={dataURL} className={styles.fileItem} {...mediaColors} />
      ))}
    </div>
  );
}

function PropertyValue({ propSchema, rawValue, colorProps }) {
  const empty = <span className={styles.emptyValue}>{DEFAULT_EMPTY_TEXT}</span>;
  // MediaViewer no comparte los tokens CSS de RenderJsonSchema (usa los suyos
  // propios, --media-viewer-*), así que sus colores se propagan por prop en
  // vez de heredarse: si el panel está oscurecido, los chips de archivo
  // también lo quedan, en vez de verse siempre con su paleta clara default.
  const mediaColors = {
    bgColor: colorProps?.bgColor,
    borderColor: colorProps?.borderColor,
    textColor: colorProps?.textColor,
  };

  if (propSchema?.type === 'object') {
    // showTitle=false: el título del objeto ya lo muestra el label de la fila
    // padre (propSchema.title). bordered=false: ya está dentro del panel del
    // padre, no necesita su propio borde/fondo.
    return (
      <RenderJsonSchema
        schema={propSchema}
        formData={rawValue}
        className={styles.nested}
        showTitle={false}
        bordered={false}
        {...colorProps}
      />
    );
  }

  if (propSchema?.type === 'array') {
    if (!Array.isArray(rawValue) || rawValue.length === 0) return empty;

    if (propSchema?.items?.format === 'data-url') {
      return getDataURLs(rawValue).length > 0 ? <FileValue rawValue={rawValue} mediaColors={mediaColors} /> : empty;
    }

    const labels = rawValue.map((item) => formatPrimitiveValue(propSchema?.items, item)).filter(Boolean);
    return labels.length > 0 ? <span>{labels.join(', ')}</span> : empty;
  }

  if (propSchema?.format === 'data-url') {
    return getDataURLs(rawValue).length > 0 ? <FileValue rawValue={rawValue} mediaColors={mediaColors} /> : empty;
  }

  const formatted = formatPrimitiveValue(propSchema, rawValue);
  return formatted ? <span>{formatted}</span> : empty;
}

const RenderJsonSchema = ({
  schema,
  formData,
  emptyText = DEFAULT_EMPTY_TEXT,
  showTitle = true,
  bordered = true,
  bgColor,
  textColor,
  labelColor,
  borderColor,
  className = '',
  style,
}) => {
  const properties = schema?.properties;
  const data = formData && typeof formData === 'object' ? formData : {};

  const cssVars = {
    ...(bgColor ? { '--rjs-bg': bgColor } : {}),
    ...(textColor ? { '--rjs-text': textColor } : {}),
    ...(labelColor ? { '--rjs-label': labelColor } : {}),
    ...(borderColor ? { '--rjs-border': borderColor } : {}),
  };
  const mergedStyle = { ...cssVars, ...style };
  const rootClassName = `${styles.root} ${bordered ? styles.bordered : ''} ${className}`.trim();
  const colorProps = { bgColor, textColor, labelColor, borderColor };

  if (!properties || typeof properties !== 'object') {
    return (
      <div className={rootClassName} style={mergedStyle}>
        <span className={styles.emptyValue}>{emptyText}</span>
      </div>
    );
  }

  const entries = Object.entries(properties);

  return (
    <div className={rootClassName} style={mergedStyle}>
      {showTitle && schema.title && <p className={styles.sectionTitle}>{schema.title}</p>}
      {entries.map(([key, propSchema]) => (
        <div key={key} className={styles.row}>
          <span className={styles.label}>{propSchema?.title || key}</span>
          <div className={styles.value}>
            <PropertyValue propSchema={propSchema} rawValue={data[key]} colorProps={colorProps} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderJsonSchema;
