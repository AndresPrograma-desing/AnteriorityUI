import React from 'react';
import styles from './index.module.css';
import Paginador from '../Material-UI/Components/Paginador';
import Barnner from '../Barnner';
import Loading from '../Loading/index';
import { ContainerSkeleton } from './components/index.js';
import { DEFAULT_SIZE as DEFAULT_STEPPER_SIZE } from '../Stepper/constants.js';
import Stepper from '../Stepper/index';
import { DEFAULT_INPUT_VARIANT, DEFAULT_LOADING_VARIANT, DEFAULT_WATERMARK_TEXT, DEFAULT_WATERMARK_BG_COLOR } from './constants.js';
import { pickSchemaFields } from './utils.js';
import SchemaFormLoader from '../../../common/schema-form/SchemaFormLoader/index';

export default function Container({ 
  wattermark = false,
  wattermarkText = DEFAULT_WATERMARK_TEXT,
  wattermarkProps = {},
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
  showStepper = false,
  steps = [],
  activeStep = 0,
  onStepClick,
  stepperProps = {},
  schema,
  uiSchema,
  formData,
  onFormChange,
  onFormSubmit,
  onFormError,
  formDisabled = false,
  schemaMissingLabel,
  showFormSubmit = true,
  schemaFormProps = {},
  loading = false,
  formLoading = false,
  loadingText,
  loadingVariant = DEFAULT_LOADING_VARIANT,
  loadingColor,
  loadingProps = {},
  showFormSkeleton,
  header,
  stickyHeader = true,
  headerBgColor,
  headerTextColor,
  headerBorderColor,
  bgImage,
  blurBackground = false,
  style,
  ...props
}) {
  const containerStyle = {
    ...(borderColor ? { '--container-border': borderColor } : {}),
    ...(headerBgColor ? { '--container-header-bg': headerBgColor } : {}),
    ...(headerTextColor ? { '--container-header-text': headerTextColor } : {}),
    ...(headerBorderColor ? { '--container-header-border': headerBorderColor } : {}),
    ...(bgImage ? { '--container-bg-image': `url(${bgImage})` } : {}),
    ...(bgImage && blurBackground ? { '--container-bg-blur': 'blur(12px)' } : {}),
    ...style,
  };

  // El formulario es independiente del Stepper. Si no hay `schema` propio pero el paso activo
  // trae uno (`steps[i].schema` / `steps[i].uiSchema`), se muestra el del paso.
  const activeStepData = showStepper ? steps[activeStep] : undefined;
  const formSchema = schema ?? activeStepData?.schema;
  const formUiSchema = schema ? uiSchema : (activeStepData?.uiSchema ?? uiSchema);

  // Con `loadingVariant="skeleton"` (default) y algo estructurado por venir (Stepper y/o formulario)
  // se muestra un esqueleto con esa forma; si no, el Loading genérico de esa variante.
  const formSkeleton = showFormSkeleton ?? (showStepper || Boolean(schema));
  const skeletonShape = loadingVariant === 'skeleton' && (showStepper || formSkeleton);

  return (
    <div
      className={`${styles.containerCard} ${bgImage ? styles.hasBgImage : ''} ${className}`}
      style={Object.keys(containerStyle).length ? containerStyle : undefined}
      {...props}
    >

      {header && (
        <div className={`${styles.header} ${stickyHeader ? styles.headerSticky : ''}`}>
          {header}
        </div>
      )}
      {wattermark &&
      <Barnner bgColor={DEFAULT_WATERMARK_BG_COLOR} {...wattermarkProps}>{wattermarkText}</Barnner>}
      {loading && (
        <div className={`${styles.loadingBlock} ${skeletonShape ? styles.loadingBlockShaped : ''}`}>
          {skeletonShape ? (
            <ContainerSkeleton
              showStepper={showStepper}
              stepCount={steps.length || undefined}
              stepSize={stepperProps.size ?? DEFAULT_STEPPER_SIZE}
              showForm={formSkeleton}
              columns={uiSchema?.['ui:options']?.columns}
              color={loadingColor}
            />
          ) : (
            <Loading variant={loadingVariant} text={loadingText} color={loadingColor} {...loadingProps} />
          )}
        </div>
      )}
      {!loading && showStepper && (
        <div className={styles.stepperContainer}>
          <Stepper
            surface="plain"
            steps={steps}
            activeStep={activeStep}
            onStepClick={onStepClick}
            {...stepperProps}
          />
        </div>
      )}
      {children}
      {!loading && formLoading && (
        <div className={`${styles.loadingBlock} ${styles.loadingBlockShaped}`}>
          {loadingVariant === 'skeleton' ? (
            <ContainerSkeleton showForm columns={formUiSchema?.['ui:options']?.columns} color={loadingColor} />
          ) : (
            <Loading variant={loadingVariant} text={loadingText} color={loadingColor} {...loadingProps} />
          )}
        </div>
      )}
      {!loading && !formLoading && formSchema && (
        <SchemaFormLoader
          // Con steps por paso se remonta al cambiar de paso para no arrastrar el estado interno.
          key={schema ? 'form' : `step-${activeStep}`}
          schema={formSchema}
          uiSchema={formUiSchema}
          formData={formData}
          showSubmitButton={showFormSubmit}
          disabled={formDisabled}
          onChange={onFormChange}
          onSubmit={(values, event) => onFormSubmit?.(values, event, {
            step: showStepper && !schema ? activeStep : undefined,
            stepData: pickSchemaFields(formSchema, values),
          })}
          onError={onFormError}
          schemaFormProps={{ inputVariant: DEFAULT_INPUT_VARIANT, ...schemaFormProps }}
          missingLabel={schemaMissingLabel}
          loadingColor={loadingColor}
        />
      )}
      {!loading && showPagination && (
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
