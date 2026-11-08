import React, { useState, useEffect } from 'react';
import { Download, X, FilePlus } from 'lucide-react';
import Button from '../Button/index';
import styles from './index.module.css';
import {
  MEDIA_KIND,
  DEFAULT_DOWNLOAD_LABEL,
  DEFAULT_OPEN_LABEL,
  DEFAULT_DROP_LABEL,
  DEFAULT_DROP_ACTIVE_LABEL,
  DEFAULT_CLEAR_LABEL,
  DEFAULT_XLSX_CREATE_LABEL,
  DEFAULT_XLSX_NEW_BAR_LABEL,
  DEFAULT_VIDEO_BG,
  DEFAULT_VIDEO_ACCENT,
  DEFAULT_VIDEO_CONTROLS_COLOR,
  DEFAULT_VIDEO_ERROR_LABEL,
  DEFAULT_RETRY_LABEL,
  DEFAULT_LOADING_VARIANT,
  DEFAULT_LOADING_SIZE,
  DEFAULT_AUDIO_ACCENT,
  DEFAULT_AUDIO_CONTROLS_COLOR,
  DEFAULT_AUDIO_ICON_BG,
  DEFAULT_AUDIO_ERROR_LABEL,
  DEFAULT_PDF_ACCENT,
  DEFAULT_PDF_TEXT_COLOR,
  DEFAULT_PDF_BG_COLOR,
  DEFAULT_PDF_ERROR_LABEL,
  DEFAULT_DOCX_ACCENT,
  DEFAULT_DOCX_TEXT_COLOR,
  DEFAULT_DOCX_BG_COLOR,
  DEFAULT_DOCX_ERROR_LABEL,
  DEFAULT_MARKDOWN_ACCENT,
  DEFAULT_MARKDOWN_TEXT_COLOR,
  DEFAULT_MARKDOWN_BG_COLOR,
  DEFAULT_MARKDOWN_ERROR_LABEL,
  DEFAULT_XLSX_ACCENT,
  DEFAULT_XLSX_TEXT_COLOR,
  DEFAULT_XLSX_BG_COLOR,
  DEFAULT_XLSX_HEADER_BG_COLOR,
  DEFAULT_XLSX_BORDER_COLOR,
  DEFAULT_XLSX_ERROR_LABEL,
  DEFAULT_XLSX_COPY_LABEL,
  DEFAULT_XLSX_COPIED_LABEL,
  DEFAULT_XLSX_EMPTY_LABEL,
} from './constants.js';
import { resolveMediaKind, getFileName, formatFileSize } from './utils.js';
import { getFileTypeInfo } from '../../../common/icons/fileType.js';
import { VideoPlayer, AudioPlayer, PdfViewer, DocxViewer, MarkdownViewer, XlsxViewer } from './components/index.js';
import FileDropZone from '../FileDropZone/index';

// Prueba si `url` carga como <img>/<video>/<audio> real, sin tocar el DOM visible.
// A diferencia de fetch(), cargar un <img>/<video>/<audio> NO está sujeto a CORS para
// mostrarse (solo lo estaría para leer sus bytes) — por eso esto funciona incluso contra
// CDNs/APIs que no mandan Access-Control-Allow-Origin (ej. picsum.photos).
function probeMediaTag(tagName, url) {
  return new Promise((resolve) => {
    const el = document.createElement(tagName);
    const cleanup = () => {
      el.onload = null;
      el.onloadedmetadata = null;
      el.onerror = null;
      el.src = '';
    };
    el.onload = el.onloadedmetadata = () => {
      cleanup();
      resolve(true);
    };
    el.onerror = () => {
      cleanup();
      resolve(false);
    };
    el.src = url;
  });
}

// Cuando la extensión/mimeType no alcanzan para inferir el tipo (ej. una url de API sin
// extensión, como /api/files/42/raw, o un CDN como picsum.photos), se prueba la url en
// cascada contra <img> → <video> → <audio> reales. Si ninguna carga, se mantiene el
// fallback a MEDIA_KIND.FILE.
function useDetectedKind(resolvedUrl, baseKind, enabled) {
  const [detectedKind, setDetectedKind] = useState(null);

  useEffect(() => {
    setDetectedKind(null);
    if (!enabled || baseKind !== MEDIA_KIND.FILE || !resolvedUrl) return undefined;

    let cancelled = false;

    (async () => {
      const candidates = [
        ['img', MEDIA_KIND.IMAGE],
        ['video', MEDIA_KIND.VIDEO],
        ['audio', MEDIA_KIND.AUDIO],
      ];
      for (const [tagName, kind] of candidates) {
        if (cancelled) return;
        // eslint-disable-next-line no-await-in-loop
        const loaded = await probeMediaTag(tagName, resolvedUrl);
        if (loaded) {
          if (!cancelled) setDetectedKind(kind);
          return;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resolvedUrl, baseKind, enabled]);

  return detectedKind;
}

// Renderiza un archivo (imagen, video, audio, PDF o cualquier otro tipo) a partir
// de una url/src. El tipo se puede forzar con `type`/`mimeType`; si no se pasa,
// se infiere del mimeType o de la extensión del nombre/url.
const MediaViewerBase = ({
  url,
  src,
  type,
  mimeType,
  name,
  size,
  alt,
  poster,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  downloadable = true,
  downloadLabel = DEFAULT_DOWNLOAD_LABEL,
  openLabel = DEFAULT_OPEN_LABEL,
  zoomable = true,
  actionLabel,
  actionIcon: ActionIcon = Download,
  onAction,
  autoDetectType = true,
  bgColor,
  borderColor,
  textColor,
  accentColor,
  videoBgColor = DEFAULT_VIDEO_BG,
  videoAccentColor = DEFAULT_VIDEO_ACCENT,
  videoControlsColor = DEFAULT_VIDEO_CONTROLS_COLOR,
  videoPip = true,
  videoErrorLabel = DEFAULT_VIDEO_ERROR_LABEL,
  videoRetryLabel = DEFAULT_RETRY_LABEL,
  videoLoadingVariant = DEFAULT_LOADING_VARIANT,
  videoLoadingSize = DEFAULT_LOADING_SIZE,
  audioAccentColor = DEFAULT_AUDIO_ACCENT,
  audioControlsColor = DEFAULT_AUDIO_CONTROLS_COLOR,
  audioIconBgColor = DEFAULT_AUDIO_ICON_BG,
  audioErrorLabel = DEFAULT_AUDIO_ERROR_LABEL,
  senderName,
  senderAvatar,
  avatarBgColor,
  avatarTextColor,
  pdfAccentColor = DEFAULT_PDF_ACCENT,
  pdfTextColor = DEFAULT_PDF_TEXT_COLOR,
  pdfBgColor = DEFAULT_PDF_BG_COLOR,
  pdfErrorLabel = DEFAULT_PDF_ERROR_LABEL,
  docxAccentColor = DEFAULT_DOCX_ACCENT,
  docxTextColor = DEFAULT_DOCX_TEXT_COLOR,
  docxBgColor = DEFAULT_DOCX_BG_COLOR,
  docxErrorLabel = DEFAULT_DOCX_ERROR_LABEL,
  markdownAccentColor = DEFAULT_MARKDOWN_ACCENT,
  markdownTextColor = DEFAULT_MARKDOWN_TEXT_COLOR,
  markdownBgColor = DEFAULT_MARKDOWN_BG_COLOR,
  markdownErrorLabel = DEFAULT_MARKDOWN_ERROR_LABEL,
  xlsxAccentColor = DEFAULT_XLSX_ACCENT,
  xlsxTextColor = DEFAULT_XLSX_TEXT_COLOR,
  xlsxBgColor = DEFAULT_XLSX_BG_COLOR,
  xlsxHeaderBgColor = DEFAULT_XLSX_HEADER_BG_COLOR,
  xlsxBorderColor = DEFAULT_XLSX_BORDER_COLOR,
  xlsxErrorLabel = DEFAULT_XLSX_ERROR_LABEL,
  xlsxCopyLabel = DEFAULT_XLSX_COPY_LABEL,
  xlsxCopiedLabel = DEFAULT_XLSX_COPIED_LABEL,
  xlsxEmptyLabel = DEFAULT_XLSX_EMPTY_LABEL,
  xlsxMenuLabels,
  xlsxStatsLabels,
  xlsxData,
  xlsxSchema,
  xlsxSheetName,
  xlsxValidations,
  xlsxValidationLabels,
  xlsxErrorColor,
  xlsxEditable = false,
  xlsxSaveLabel,
  xlsxNew = false,
  xlsxNewRows,
  xlsxNewCols,
  onXlsxChange,
  onXlsxSave,
  onError,
  className = '',
  style,
}) => {
  const [zoomed, setZoomed] = useState(false);
  const resolvedUrl = url || src;

  const baseKind = resolveMediaKind({ type, mimeType, url: resolvedUrl, name });
  const hasExplicitType = Boolean(type || mimeType);
  const detectedKind = useDetectedKind(resolvedUrl, baseKind, autoDetectType && !hasExplicitType);

  const hasXlsxData = Array.isArray(xlsxData);
  if (!resolvedUrl && !xlsxNew && !hasXlsxData) return null;

  const kind = (xlsxNew || hasXlsxData) && !resolvedUrl ? MEDIA_KIND.XLSX : detectedKind || baseKind;
  const fileName = getFileName(resolvedUrl, name);
  const sizeLabel = formatFileSize(size);

  const colorVars = {
    ...(bgColor ? { '--media-viewer-bg': bgColor } : {}),
    ...(borderColor ? { '--media-viewer-border': borderColor } : {}),
    ...(textColor ? { '--media-viewer-text': textColor } : {}),
    ...(accentColor ? { '--media-viewer-accent': accentColor } : {}),
  };

  const wrapperStyle = { ...colorVars, ...style };

  const actionButton = onAction && (
    <button type="button" className={styles.actionButton} onClick={onAction}>
      {ActionIcon && <ActionIcon size={16} />}
      {actionLabel}
    </button>
  );

  if (kind === MEDIA_KIND.IMAGE) {
    return (
      <div className={className} style={wrapperStyle}>
        <div
          className={`${styles.wrapper} ${styles.imageWrapper} ${zoomed ? styles.imageWrapperZoomed : ''}`}
        >
          <img
            src={resolvedUrl}
            alt={alt || fileName}
            className={`${styles.image} ${zoomable ? styles.imageZoomable : ''} ${zoomed ? styles.imageZoomed : ''}`}
            onError={onError}
            onClick={zoomable ? () => setZoomed((prev) => !prev) : undefined}
          />
        </div>
        {actionButton}
      </div>
    );
  }

  if (kind === MEDIA_KIND.VIDEO) {
    if (!controls) {
      return (
        <div className={className} style={wrapperStyle}>
          <div className={`${styles.wrapper} ${styles.videoWrapper}`}>
            <video
              src={resolvedUrl}
              poster={poster}
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              className={styles.video}
              onError={onError}
            >
              {alt}
            </video>
          </div>
          {actionButton}
        </div>
      );
    }

    return (
      <div className={className} style={wrapperStyle}>
        <div
          className={`${styles.wrapper} ${styles.videoWrapper}`}
          style={{ '--media-viewer-video-bg': videoBgColor }}
        >
          <VideoPlayer
            src={resolvedUrl}
            poster={poster}
            alt={alt}
            loop={loop}
            muted={muted}
            autoPlay={autoPlay}
            accentColor={videoAccentColor}
            controlsColor={videoControlsColor}
            pipEnabled={videoPip}
            errorLabel={videoErrorLabel}
            retryLabel={videoRetryLabel}
            loadingVariant={videoLoadingVariant}
            loadingSize={videoLoadingSize}
            onError={onError}
          />
        </div>
        {actionButton}
      </div>
    );
  }

  if (kind === MEDIA_KIND.AUDIO) {
    if (!controls) {
      return (
        <div className={className} style={wrapperStyle}>
          <div className={`${styles.wrapper} ${styles.audioWrapper}`}>
            {fileName && <div className={styles.audioFileName}>{fileName}</div>}
            <audio
              src={resolvedUrl}
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              className={styles.audio}
              onError={onError}
            />
          </div>
          {actionButton}
        </div>
      );
    }

    return (
      <div className={className} style={wrapperStyle}>
        <div className={`${styles.wrapper} ${styles.audioWrapper}`}>
          <AudioPlayer
            src={resolvedUrl}
            fileName={fileName}
            senderName={senderName}
            senderAvatar={senderAvatar}
            avatarBgColor={avatarBgColor}
            avatarTextColor={avatarTextColor}
            loop={loop}
            muted={muted}
            autoPlay={autoPlay}
            accentColor={audioAccentColor}
            controlsColor={audioControlsColor}
            iconBgColor={audioIconBgColor}
            errorLabel={audioErrorLabel}
            onError={onError}
          />
        </div>
        {actionButton}
      </div>
    );
  }

  if (kind === MEDIA_KIND.PDF) {
    if (!controls) {
      return (
        <div className={`${styles.wrapper} ${styles.pdfWrapper} ${className}`} style={wrapperStyle}>
          <iframe src={resolvedUrl} title={fileName || 'PDF'} className={styles.pdfFrame} />
          <div className={styles.fileFooter}>
            <span className={styles.fileName}>{fileName}</span>
            <a href={resolvedUrl} target="_blank" rel="noreferrer" className={styles.fileAction}>
              {openLabel}
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className={`${styles.wrapper} ${styles.pdfWrapper} ${className}`} style={wrapperStyle}>
        <PdfViewer
          url={resolvedUrl}
          fileName={fileName}
          openLabel={openLabel}
          downloadLabel={downloadLabel}
          errorLabel={pdfErrorLabel}
          accentColor={pdfAccentColor}
          textColor={pdfTextColor}
          bgColor={pdfBgColor}
        />
      </div>
    );
  }

  if (kind === MEDIA_KIND.DOCX && controls) {
    return (
      <div className={`${styles.wrapper} ${styles.pdfWrapper} ${className}`} style={wrapperStyle}>
        <DocxViewer
          url={resolvedUrl}
          fileName={fileName}
          openLabel={openLabel}
          downloadLabel={downloadLabel}
          errorLabel={docxErrorLabel}
          accentColor={docxAccentColor}
          textColor={docxTextColor}
          bgColor={docxBgColor}
        />
      </div>
    );
  }

  if (kind === MEDIA_KIND.XLSX && controls) {
    return (
      <div className={`${styles.wrapper} ${styles.pdfWrapper} ${className}`} style={wrapperStyle}>
        <XlsxViewer
          url={resolvedUrl}
          fileName={fileName}
          openLabel={openLabel}
          downloadLabel={downloadLabel}
          errorLabel={xlsxErrorLabel}
          copyLabel={xlsxCopyLabel}
          copiedLabel={xlsxCopiedLabel}
          emptyLabel={xlsxEmptyLabel}
          menuLabels={xlsxMenuLabels}
          statsLabels={xlsxStatsLabels}
          data={hasXlsxData && !resolvedUrl ? xlsxData : undefined}
          schema={xlsxSchema}
          sheetName={xlsxSheetName}
          validations={xlsxValidations}
          validationLabels={xlsxValidationLabels}
          errorColor={xlsxErrorColor}
          editable={xlsxEditable}
          createNew={xlsxNew && !resolvedUrl}
          newRows={xlsxNewRows}
          newCols={xlsxNewCols}
          saveLabel={xlsxSaveLabel}
          onChange={onXlsxChange}
          onSave={onXlsxSave}
          accentColor={xlsxAccentColor}
          textColor={xlsxTextColor}
          bgColor={xlsxBgColor}
          headerBgColor={xlsxHeaderBgColor}
          borderColor={xlsxBorderColor}
        />
      </div>
    );
  }

  if (kind === MEDIA_KIND.MARKDOWN && controls) {
    return (
      <div className={`${styles.wrapper} ${styles.pdfWrapper} ${className}`} style={wrapperStyle}>
        <MarkdownViewer
          url={resolvedUrl}
          openLabel={openLabel}
          errorLabel={markdownErrorLabel}
          accentColor={markdownAccentColor}
          textColor={markdownTextColor}
          bgColor={markdownBgColor}
        />
      </div>
    );
  }

  const { icon: Icon, bgColor: typeColor, label: typeLabel } = getFileTypeInfo(fileName || resolvedUrl);

  return (
    <div className={`${styles.wrapper} ${styles.fileCard} ${className}`} style={wrapperStyle}>
      <div className={styles.fileIcon} style={{ backgroundColor: typeColor }}>
        <Icon size={20} />
      </div>
      <div className={styles.fileInfo}>
        <span className={styles.fileName}>{fileName || typeLabel}</span>
        <span className={styles.fileMeta}>
          {typeLabel}
          {sizeLabel ? ` · ${sizeLabel}` : ''}
        </span>
      </div>
      {downloadable && (
        <a
          href={resolvedUrl}
          download={fileName || undefined}
          target="_blank"
          rel="noreferrer"
          className={styles.downloadButton}
          aria-label={downloadLabel}
          title={downloadLabel}
        >
          <Download size={18} />
        </a>
      )}
    </div>
  );
};

// Con `droppable`, el archivo lo aporta el usuario: arrastrándolo, pegándolo o eligiéndolo. Se muestra
// con el mismo visor que una url (el File se expone como blob: URL, revocada al cambiar/desmontar).
// Si además se pasa `url`/`src`, se muestra ese archivo hasta que el usuario cargue uno propio.
const DroppableMediaViewer = ({
  accept,
  onFileSelect,
  onFileReject,
  onClear,
  dropLabel = DEFAULT_DROP_LABEL,
  dropActiveLabel = DEFAULT_DROP_ACTIVE_LABEL,
  clearLabel = DEFAULT_CLEAR_LABEL,
  creatable = false,
  createLabel = DEFAULT_XLSX_CREATE_LABEL,
  newBarLabel = DEFAULT_XLSX_NEW_BAR_LABEL,
  dropBgColor,
  dropBorderColor,
  dropTextColor,
  dropAccentColor,
  pasteEnabled = true,
  ...props
}) => {
  const [file, setFile] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [creating, setCreating] = useState(false); // planilla nueva en blanco (xlsxNew)

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return undefined;
    }
    const created = URL.createObjectURL(file);
    setObjectUrl(created);
    return () => URL.revokeObjectURL(created);
  }, [file]);

  const handleFile = (next) => {
    setCreating(false);
    setFile(next);
    onFileSelect?.(next);
  };

  const handleClear = () => {
    setFile(null);
    setCreating(false);
    onClear?.();
  };

  const hasContent = Boolean(file ? objectUrl : props.url || props.src) || creating;

  return (
    <FileDropZone
      onFile={handleFile}
      onReject={onFileReject}
      accept={accept}
      pasteEnabled={pasteEnabled}
      label={dropLabel}
      activeLabel={dropActiveLabel}
      extra={
        creatable && (
          <Button size="small" variant="outline" icon={FilePlus} onClick={() => setCreating(true)}>
            {createLabel}
          </Button>
        )
      }
      bgColor={dropBgColor}
      borderColor={dropBorderColor}
      textColor={dropTextColor}
      accentColor={dropAccentColor}
      className={props.className}
    >
      {hasContent && (
        <>
          {(file || creating) && (
            <div className={styles.localFileBar}>
              <span className={styles.localFileName}>{file ? file.name : newBarLabel}</span>
              <Button size="small" variant="ghost" color="transparent" icon={X} onClick={handleClear}>
                {clearLabel}
              </Button>
            </div>
          )}
          {file ? (
            <MediaViewerBase
              {...props}
              className=""
              url={objectUrl}
              src={undefined}
              name={file.name}
              size={file.size}
              mimeType={file.type || undefined}
              type={undefined}
            />
          ) : creating ? (
            <MediaViewerBase {...props} className="" url={undefined} src={undefined} xlsxNew />
          ) : (
            <MediaViewerBase {...props} className="" />
          )}
        </>
      )}
    </FileDropZone>
  );
};

const MediaViewer = ({ droppable = false, ...props }) =>
  droppable ? <DroppableMediaViewer {...props} /> : <MediaViewerBase {...props} />;

MediaViewer.KIND = MEDIA_KIND;

export default MediaViewer;
