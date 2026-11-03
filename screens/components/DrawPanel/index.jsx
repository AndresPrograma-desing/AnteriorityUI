import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { XCircle } from 'lucide-react';
import styles from './index.module.css';
import { SchemaFormContent } from './components/index.js';
import { DEFAULT_SCHEMA_FORM_ID_PREFIX, DEFAULT_SCHEMA_MISSING_LABEL } from './constants.js';
import { isEmptyValue, hasUserValues, getSchemaRequiredFields } from './utils.js';

import Button from '../Button/index';
import CountdownBar from '../CountdownBar/index';
import Loading from '../Loading/index';
import MarkdownContent from '../MarkdownContent/index';

const DrawPanel = ({ 
  isOpen, 
  onClose, 
  title, 
  closeIcon : CloseIcon = XCircle,
  description,
  descriptionPosition = 'top',
  markdown,
  markdownProps,
  children,
  width = '400px',
  showActions = true,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonProps,
  cancelButtonProps,
  formId,
  schema,
  uiSchema,
  defaultFormData,
  onFormDataChange,
  onSubmit,
  onSubmitError,
  schemaFormProps,
  schemaMissingLabel = DEFAULT_SCHEMA_MISSING_LABEL,
  loading = false,
  contentLoading = false,
  contentLoadingText,
  typeLoading = 'default',
  success = undefined,
  className = '',
  showCountdown = false,
  countdownActive = true,
  countdownDuration,
  countdownOnComplete,
  countdownExpiresAt,
  countdownTotalDuration,
  countdownValue,
  countdownHeight,
  countdownColors,
  countdownIncrement = true,
  progressMode,
  totalFields = 0,
  filledFields = 0,
  totalItems = [],
  selectedItems = [],
  formData,
  requiredFields = [],
  panelColor = '#ffffff',
  textColor = '#0f172a',
  mutedTextColor = '#64748b',
  borderColor = '#e2e8f0',
  hasUnsavedChanges,
  closeConfirmMessage = 'Vuelve a hacer clic fuera para cerrar sin guardar',
  anchor = 'right',
  style
}) => {
  const [render, setRender] = useState(isOpen);
  const [pendingClose, setPendingClose] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pendingCloseTimeoutRef = useRef(null);

  // Modo JSON Schema: si llega `schema`, el panel pinta un formulario dinámico (SchemaForm) en su
  // área de contenido. Los datos pueden ser controlados (prop `formData`) o internos (el panel los
  // guarda y los reinicia a `defaultFormData` al cerrarse).
  const isSchemaMode = Boolean(schema);
  const isFormDataControlled = formData !== undefined;
  const [internalFormData, setInternalFormData] = useState(defaultFormData);
  const generatedFormId = useId();
  const resolvedFormId = formId ?? (isSchemaMode ? `${DEFAULT_SCHEMA_FORM_ID_PREFIX}${generatedFormId}` : undefined);

  useEffect(() => {
    if (isOpen) setRender(true);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (pendingCloseTimeoutRef.current) clearTimeout(pendingCloseTimeoutRef.current);
    };
  }, []);

  const onAnimationEnd = () => {
    if (!isOpen) {
      setRender(false);
      setPendingClose(false);
      if (!isFormDataControlled) setInternalFormData(defaultFormData);
      if (pendingCloseTimeoutRef.current) {
        clearTimeout(pendingCloseTimeoutRef.current);
        pendingCloseTimeoutRef.current = null;
      }
    }
  };

  if (!render) return null;

  // Contenido "sucio": si hay datos cargados en el formulario, un solo clic (fuera
  // o en el botón de cerrar) no cierra el panel, para no perder lo que el usuario
  // escribió; requiere un segundo clic. Sin datos, el panel se cierra normalmente.
  // Con schema los datos pueden ser objetos/arrays anidados y booleanos (String(val) daría falsos
  // positivos como "[object Object]"), así que se usa una detección recursiva.
  const currentFormData = isSchemaMode && !isFormDataControlled ? internalFormData : formData;
  const formHasValues = isSchemaMode
    ? hasUserValues(currentFormData)
    : currentFormData
      ? Object.values(currentFormData).some((val) => val !== undefined && val !== null && String(val).trim() !== '')
      : false;
  const isDirty = hasUnsavedChanges ?? formHasValues;

  const handleSchemaChange = (nextFormData, event) => {
    if (!isFormDataControlled) setInternalFormData(nextFormData);
    onFormDataChange?.(nextFormData, event);
  };

  const handleCloseClick = () => {
    if (!isDirty) {
      onClose();
      return;
    }
    if (pendingClose) {
      if (pendingCloseTimeoutRef.current) clearTimeout(pendingCloseTimeoutRef.current);
      setPendingClose(false);
      onClose();
      return;
    }
    setPendingClose(true);
    pendingCloseTimeoutRef.current = setTimeout(() => setPendingClose(false), 2500);
  };

  // Lógica Genérica de Cálculo de Progreso
  let calculatedProgress = countdownValue ?? 0;

  // Con schema el progreso por default sigue a los campos `required` del propio schema.
  const resolvedProgressMode = progressMode ?? (isSchemaMode ? 'form' : 'count');
  const effectiveRequiredFields =
    requiredFields?.length > 0 ? requiredFields : isSchemaMode ? getSchemaRequiredFields(schema) : [];

  if (resolvedProgressMode === 'selection') {
    const total = Array.isArray(totalItems) ? totalItems.length : Number(totalItems) || 0;
    const selected = Array.isArray(selectedItems) ? selectedItems.length : Number(selectedItems) || 0;
    calculatedProgress = total > 0 ? (selected / total) * 100 : 0;
  } else if (resolvedProgressMode === 'form' && currentFormData && effectiveRequiredFields.length > 0) {
    const filledCount = effectiveRequiredFields.filter(field => {
      const val = currentFormData[field];
      return isSchemaMode ? !isEmptyValue(val) : val !== undefined && val !== null && String(val).trim() !== '';
    }).length;
    calculatedProgress = (filledCount / effectiveRequiredFields.length) * 100;
  } else if (resolvedProgressMode === 'count' && totalFields > 0) {
    calculatedProgress = Math.min(100, Math.max(0, (filledFields / totalFields) * 100));
  }

  const overlayClass = anchor === 'top' ? styles.overlayTop : styles.overlay;
  const panelClass = anchor === 'top' ? styles.panelTop : styles.panel;
  const animClass = isOpen
    ? (anchor === 'top' ? styles.slideInTop : styles.slideIn)
    : (anchor === 'top' ? styles.slideOutTop : styles.slideOut);

  return createPortal(
    <div
      className={`${overlayClass} ${isOpen ? styles.fadeIn : styles.fadeOut}`}
      onClick={handleCloseClick}
      onAnimationEnd={onAnimationEnd}
    >
      <div
        className={`${panelClass} ${animClass} ${className}`}
        style={{ maxWidth: width, backgroundColor: panelColor, ...style }}
        onClick={(e) => e.stopPropagation()}
      >
        {pendingClose && (
          <div className={styles.closeHint}>{closeConfirmMessage}</div>
        )}

        <div className={styles.header} style={{ backgroundColor: panelColor, borderBottomColor: borderColor }}>
          <div className={styles.headerTop}>
            <div className={styles.headerTitleContainer}>
              <h3 className={styles.title} style={{ color: textColor }}>{title}</h3>
              {description && !markdown && descriptionPosition === 'top' && (
                <p className={styles.description} style={{ color: mutedTextColor }}>{description}</p>
              )}
              {markdown && descriptionPosition === 'top' && (
                <MarkdownContent className={styles.markdownTop} style={{ color: mutedTextColor }} {...markdownProps}>
                  {markdown}
                </MarkdownContent>
              )}
            </div>
            <div className={styles.closeButtonWrapper}>
              <Button
                variant={Button.VARIANTS.DANGER}
                color={Button.COLORS.TRANSPARENT}
                onClick={handleCloseClick}
                circle
                aria-label="Cerrar panel"
              >
                <CloseIcon size={24} color={mutedTextColor} />
              </Button>
            </div>
          </div>

          {showCountdown && (
            <div className={styles.countdownWrapper}>
              <CountdownBar
                active={countdownActive}
                duration={countdownDuration}
                onComplete={countdownOnComplete}
                expiresAt={countdownExpiresAt}
                totalDuration={countdownTotalDuration}
                value={calculatedProgress}
                height={countdownHeight}
                colors={countdownColors}
                width="100%"
                increment={countdownIncrement}
              />
            </div>
          )}
        </div>

        <div
          className={`${styles.content} ${isScrolled ? styles.contentScrolled : ''}`}
          style={isScrolled ? { '--draw-panel-scroll-shadow': borderColor } : undefined}
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 0)}
        >
          {contentLoading ? (
            <div className={styles.contentLoading}>
              <Loading
              text={contentLoadingText}
              variant={typeLoading?.toLowerCase?.() === 'skeleton' ? 'skeleton' : typeLoading}
              size='large'
              fullHeight
              color={mutedTextColor} />
            </div>
          ) : (
            <>
              {isSchemaMode && (
                <SchemaFormContent
                  schema={schema}
                  uiSchema={uiSchema}
                  formData={currentFormData}
                  formId={resolvedFormId}
                  showSubmitButton={!showActions}
                  disabled={loading}
                  onChange={handleSchemaChange}
                  onSubmit={onSubmit}
                  onError={onSubmitError}
                  schemaFormProps={schemaFormProps}
                  missingLabel={schemaMissingLabel}
                  textColor={textColor}
                  loadingColor={mutedTextColor}
                />
              )}
              {children}
              {markdown && descriptionPosition === 'bottom' && (
                <div className={styles.descriptionBottom} style={{ borderTopColor: borderColor }}>
                  <MarkdownContent style={{ color: mutedTextColor }} {...markdownProps}>
                    {markdown}
                  </MarkdownContent>
                </div>
              )}
              {description && !markdown && descriptionPosition === 'bottom' && (
                <div className={styles.descriptionBottom} style={{ borderTopColor: borderColor }}>
                  <h4 className={styles.descriptionBottomTitle} style={{ color: textColor }}>Descripción de Tarea</h4>
                  <p className={styles.descriptionBottomText} style={{ color: mutedTextColor }}>{description}</p>
                </div>
              )}
            </>
          )}
        </div>

        {showActions && (
          <div className={styles.footer} style={{ backgroundColor: panelColor, borderTopColor: borderColor }}>
            <Button
              variant=""
              onClick={onClose}
              border={Button.COLORS.RED}
              disabled={loading}
              fullWidth
              {...cancelButtonProps}
            >
              {cancelButtonProps?.children ?? cancelText}
            </Button>
            <Button
              type={resolvedFormId ? 'submit' : 'button'}
              form={resolvedFormId}
              variant="primary"
              color={Button.COLORS.PRIMARY}
              onClick={onConfirm}
              loading={loading}
              success={success}
              fullWidth
              {...confirmButtonProps}
            >
              {confirmButtonProps?.children ?? confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default DrawPanel;
