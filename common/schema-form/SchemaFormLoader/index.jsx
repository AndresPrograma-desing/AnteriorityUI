import React, { useEffect, useState } from 'react';
import Loading from '../../../screens/components/Loading/index';
import ErrorState from '../../../screens/components/ErrorState/index';
import styles from './index.module.css';

// Pieza compartida (DrawPanel, Container). SchemaForm depende de @rjsf/core, que es una peer
// dependency OPCIONAL de la librería. Si el padre lo importara de forma estática, todo proyecto
// que lo use (con o sin schema) tendría que instalar rjsf. Por eso se carga con un import dinámico, solo cuando el padre recibe
// un `schema`; el módulo queda cacheado para que reabrir el padre no vuelva a mostrar el loading.
let cachedSchemaForm = null;

// Renderiza el formulario del JSON Schema que recibe el padre, dentro de su área de contenido.
// No agrega botones propios salvo que se pida (`showSubmitButton`, cuando el panel no muestra su
// footer): el submit lo dispara el botón confirmar del footer vía `formId`.
const SchemaFormLoader = ({
  schema,
  uiSchema,
  formData,
  formId,
  showSubmitButton,
  disabled,
  onChange,
  onSubmit,
  onError,
  schemaFormProps,
  missingLabel,
  textColor,
  loadingColor,
}) => {
  const [SchemaForm, setSchemaForm] = useState(() => cachedSchemaForm);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (cachedSchemaForm) return undefined;
    let cancelled = false;
    import('../../../screens/components/SchemaForm/index')
      .then((module) => {
        cachedSchemaForm = module.default;
        if (!cancelled) setSchemaForm(() => module.default);
      })
      .catch((err) => {
        console.error('[SchemaForm] No se pudo cargar SchemaForm:', err);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return <ErrorState errorLabel={missingLabel} textColor={textColor} />;
  }

  if (!SchemaForm) {
    return (
      <div className={styles.fallback}>
        <Loading variant="default" size="medium" color={loadingColor} />
      </div>
    );
  }

  return (
    <SchemaForm
      formId={formId}
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      showSubmitButton={showSubmitButton}
      onChange={onChange}
      onSubmit={onSubmit}
      onError={onError}
      {...schemaFormProps}
      disabled={disabled || schemaFormProps?.disabled}
    />
  );
};

export default SchemaFormLoader;
