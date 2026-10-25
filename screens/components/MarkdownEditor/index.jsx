import { useRef, useState } from 'react';
import usePasteImage from '../../../common/hooks/usePasteImage';
import { Toolbar, EditorContent, ResizeHandle } from './components/index.js';
import styles from './index.module.css';
import { DEFAULT_LABELS, DEFAULT_PENDING_COLOR, DOUBLE_CLICK_COLLAPSED_HEIGHT, DOUBLE_CLICK_EXPANDED_HEIGHT, DOUBLE_CLICK_EXPAND_THRESHOLD } from './constants.js';
import {
  buildImageToken,
  buildLinePrefixInsertion,
  buildListContinuation,
  buildPlainInsertion,
  buildTableTemplate,
  buildWrappedInsertion,
  clampEditorHeight,
  generateImageId,
  getDoubleClickHeight,
  replaceImageTokenInValue,
} from './utils.js';

export const MarkdownEditor = ({
  value = '',
  onChange,
  placeholder = '',
  defaultHeight = 320,
  labels = {},
  activeColor,
  scrollbarColor,
  className = '',
  style,
  images,
  onImagesChange,
  onImageUpload,
}) => {
  const {
    editorTab,
    splitTab,
    previewTab,
    splitEmptyPreview,
    previewEmptyPreview,
    boldTooltip,
    italicTooltip,
    titleTooltip,
    heading2Tooltip,
    heading3Tooltip,
    bulletListTooltip,
    orderedListTooltip,
    quoteTooltip,
    codeBlockTooltip,
    linkTooltip,
    imageTooltip,
    colorTooltip,
    tableTooltip,
    copyableTooltip,
    resizeHandleTitle,
    boldDefaultText,
    italicDefaultText,
    linkDefaultText,
    codeDefaultText,
    imageAltDefaultText,
    imageUrlPlaceholder,
    colorDefaultText,
    applyColorLabel,
    tableColumnLabels,
    tableRowLabels,
    copyableDefaultText,
  } = { ...DEFAULT_LABELS, ...labels };

  const [viewMode, setViewMode] = useState('write'); // 'write' | 'split' | 'preview'
  const [editorHeight, setEditorHeight] = useState(defaultHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [pendingColor, setPendingColor] = useState(DEFAULT_PENDING_COLOR);
  // Mapa interno id -> base64 de las imágenes pegadas (Ctrl+V) que todavía no se
  // reemplazaron por una URL real. Si `images` viene controlado (el consumidor ya subió
  // algunas y las reemplazó), se parte de eso en vez de un mapa vacío.
  const [pastedImages, setPastedImages] = useState(() => images ?? {});
  const textareaRef = useRef(null);
  const colorButtonRef = useRef(null);
  // Guarda la selección actual (y su rango) antes de abrir el popover del ColorPicker,
  // porque hacer click en el botón de color le quita el foco/selección al textarea.
  const colorSelectionRef = useRef({ start: 0, end: 0 });
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(defaultHeight);
  // onImageUpload resuelve de forma asíncrona (puede tardar) — para cuando resuelve, el
  // usuario pudo haber seguido escribiendo, así que el reemplazo del token debe leer el
  // `value` más reciente en vez de capturar el de cuando se disparó el paste (closure
  // obsoleta). onChange también se referencia por ref por el mismo motivo.
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const emitChange = (newContent) => onChange({ target: { value: newContent } });

  const focusSelection = (textarea, start, end) => {
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end);
    }, 0);
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
    setIsDragging(true);
    dragStartYRef.current = event.clientY;
    dragStartHeightRef.current = editorHeight;

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - dragStartYRef.current;
      setEditorHeight(clampEditorHeight(dragStartHeightRef.current + deltaY));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = () => {
    setEditorHeight((prev) =>
      getDoubleClickHeight(prev, DOUBLE_CLICK_COLLAPSED_HEIGHT, DOUBLE_CLICK_EXPANDED_HEIGHT, DOUBLE_CLICK_EXPAND_THRESHOLD)
    );
  };

  const insertFormatting = (before, after = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { newContent, newSelectionStart, newSelectionEnd } = buildWrappedInsertion(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      before,
      after,
      defaultText
    );

    emitChange(newContent);
    focusSelection(textarea, newSelectionStart, newSelectionEnd);
  };

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { newContent, newSelectionStart, newSelectionEnd } = buildPlainInsertion(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      text
    );

    emitChange(newContent);
    focusSelection(textarea, newSelectionStart, newSelectionEnd);
  };

  const insertLinePrefix = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { newContent, newSelectionStart, newSelectionEnd } = buildLinePrefixInsertion(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      prefix
    );

    emitChange(newContent);
    focusSelection(textarea, newSelectionStart, newSelectionEnd);
  };

  // Reemplaza el token [imagen:id] (en cualquier posición del texto actual, no
  // necesariamente donde estaba el cursor al pegar) por la URL final subida. Lee
  // value/onChange por ref porque esto corre después de que resuelve una promesa
  // asíncrona (onImageUpload): para entonces el usuario pudo haber seguido escribiendo.
  const replaceImageToken = (id, url) => {
    const newContent = replaceImageTokenInValue(valueRef.current, id, url);
    if (newContent !== valueRef.current) onChangeRef.current({ target: { value: newContent } });
  };

  // Convierte cada imagen pegada (Ctrl+V) a base64 e inserta un token corto
  // [imagen:id] en el texto en vez del base64 completo (se vería como un string
  // gigante en el textarea) — MarkdownContent resuelve el token a la imagen real en el
  // preview vía la prop `images` mientras no haya URL final. El mapa completo
  // {id: base64} se expone con onImagesChange para que el consumidor lo use si lo
  // necesita (ej. mostrar un estado de "subiendo" en otro lado de su UI).
  //
  // Si se pasa `onImageUpload(file, id)`, se llama con cada imagen pegada esperando una
  // Promise<string> con la URL pública final (ej. tras subirla a su storage): mientras
  // está pendiente, el markdown mantiene el token (resuelto a base64 en el preview); al
  // resolver, el token se reemplaza por `![](url)` en `value` automáticamente — así, al
  // copiar/exportar el markdown, ya queda con la URL pública en vez del base64. Si la
  // promesa rechaza, o no se pasa onImageUpload, el token queda resuelto a base64
  // indefinidamente (ver MarkdownContent, prop `images`).
  const handleImagePaste = (files) => {
    files.forEach((file) => {
      const id = generateImageId();
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        setPastedImages((prev) => {
          const next = { ...prev, [id]: base64 };
          onImagesChange?.(next);
          return next;
        });
        insertAtCursor(buildImageToken(id));

        if (onImageUpload) {
          Promise.resolve(onImageUpload(file, id))
            .then((url) => {
              if (typeof url === 'string' && url) replaceImageToken(id, url);
            })
            .catch(() => {
              // Falla silenciosa a propósito: se mantiene el base64 como fallback,
              // consistente con el resto de la librería (ver PasswordResetPanel/
              // UserEditPopover en CLAUDE.md) de no romper el render por un fallo de red.
            });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const { onPaste: handleTextareaPaste } = usePasteImage({ onImagePaste: handleImagePaste });

  const handleKeyDown = (event) => {
    // Shortcuts: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+K (Link)
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      insertFormatting('**', '**', boldDefaultText);
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      event.preventDefault();
      insertFormatting('*', '*', italicDefaultText);
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      insertFormatting('[', '](https://)', linkDefaultText);
    } else if (event.key === 'Enter') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const continuation = buildListContinuation(value, textarea.selectionStart);
      if (!continuation) return;

      event.preventDefault();
      emitChange(continuation.newContent);
      focusSelection(textarea, continuation.newCursorPosition, continuation.newCursorPosition);
    }
  };

  const insertTable = () => {
    insertFormatting(buildTableTemplate(tableColumnLabels, tableRowLabels), '');
  };

  const insertImage = () => {
    insertFormatting('![', `](${imageUrlPlaceholder})`, imageAltDefaultText);
  };

  const toggleColorPicker = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      colorSelectionRef.current = { start: textarea.selectionStart, end: textarea.selectionEnd };
    }
    setIsColorPickerOpen((prev) => !prev);
  };

  // ColorPickerPanel dispara onChange en cada frame mientras se arrastra (throttled, no
  // solo al soltar) — acá solo actualiza el color elegido (preview visual del swatch);
  // la inserción real en el textarea queda para el botón "Aplicar" (ver applyPendingColor).
  const handleColorPreview = (hex) => setPendingColor(hex);

  const applyPendingColor = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end } = colorSelectionRef.current;
    const { newContent, newSelectionStart, newSelectionEnd } = buildWrappedInsertion(
      value,
      start,
      end,
      `{color:${pendingColor}}`,
      '{/color}',
      colorDefaultText
    );

    emitChange(newContent);
    setIsColorPickerOpen(false);
    focusSelection(textarea, newSelectionStart, newSelectionEnd);
  };

  return (
    <div
      className={`${styles.editorContainer} ${className}`.trim()}
      style={{
        ...(activeColor ? { '--markdown-editor-active': activeColor } : {}),
        ...(scrollbarColor ? { '--markdown-editor-scrollbar-thumb': scrollbarColor } : {}),
        ...style,
      }}
    >
      <Toolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBold={() => insertFormatting('**', '**', boldDefaultText)}
        onItalic={() => insertFormatting('*', '*', italicDefaultText)}
        onHeading1={() => insertLinePrefix('# ')}
        onHeading2={() => insertLinePrefix('## ')}
        onHeading3={() => insertLinePrefix('### ')}
        onBulletList={() => insertLinePrefix('- ')}
        onOrderedList={() => insertLinePrefix('1. ')}
        onQuote={() => insertLinePrefix('> ')}
        onCodeBlock={() => insertFormatting('```\n', '\n```', codeDefaultText)}
        onLink={() => insertFormatting('[', '](https://)', linkDefaultText)}
        onImage={insertImage}
        onTable={insertTable}
        onCopyable={() => insertFormatting('{copy}', '{/copy}', copyableDefaultText)}
        colorButtonRef={colorButtonRef}
        pendingColor={pendingColor}
        isColorPickerOpen={isColorPickerOpen}
        onToggleColorPicker={toggleColorPicker}
        onCloseColorPicker={() => setIsColorPickerOpen(false)}
        onColorPreview={handleColorPreview}
        onApplyColor={applyPendingColor}
        labels={{
          editorTab,
          splitTab,
          previewTab,
          boldTooltip,
          italicTooltip,
          titleTooltip,
          heading2Tooltip,
          heading3Tooltip,
          bulletListTooltip,
          orderedListTooltip,
          quoteTooltip,
          codeBlockTooltip,
          linkTooltip,
          imageTooltip,
          colorTooltip,
          tableTooltip,
          applyColorLabel,
          copyableTooltip,
        }}
      />

      <EditorContent
        viewMode={viewMode}
        editorHeight={editorHeight}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onPaste={handleTextareaPaste}
        placeholder={placeholder}
        textareaRef={textareaRef}
        images={pastedImages}
        splitEmptyPreview={splitEmptyPreview}
        previewEmptyPreview={previewEmptyPreview}
      />

      <ResizeHandle
        isDragging={isDragging}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title={resizeHandleTitle}
      />
    </div>
  );
};

export default MarkdownEditor;
