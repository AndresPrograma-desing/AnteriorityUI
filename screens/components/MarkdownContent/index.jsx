import { useState } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './index.module.css';
import { MermaidBlock } from './MermaidBlock';
import { CopyButton } from './CopyButton';
import { extractCopyBlocks, remarkCopyBlocks } from './copyBlocks.js';

const isMermaidLanguage = (className = '') => /(^|\s)language-mermaid(\s|$)/.test(className);

const COLOR_TAG_PATTERN = /\{color:([^}]+)\}([\s\S]+?)\{\/color\}/g;
const COLOR_LINK_PROTOCOL = 'color:';
const COPY_TAG_PATTERN = /\{copy\}([\s\S]+?)\{\/copy\}/g;
const COPY_LINK_PROTOCOL = 'copy:';
// Bloques de código (```fence``` o `inline`) no deben tocarse: un snippet que por
// casualidad contenga literalmente "{color:...}" no debe convertirse en texto coloreado.
const CODE_SPAN_PATTERN = /(```[\s\S]*?```|`[^`\n]*`)/g;

// Reescribe {color:X}texto{/color} como un link markdown con protocolo custom
// ([texto](color:X)) para que remark lo parsee como un nodo real de link sin necesitar
// un plugin remark propio — el renderer de "a" de abajo lo intercepta y lo convierte en
// un <span> coloreado en vez de un <a>.
const preprocessColorTags = (markdown) => {
  if (typeof markdown !== 'string' || !markdown.includes('{color:')) return markdown;

  return markdown
    .split(CODE_SPAN_PATTERN)
    .map((segment, index) => {
      const isCodeSpan = index % 2 === 1;
      if (isCodeSpan) return segment;
      return segment.replace(COLOR_TAG_PATTERN, (_, color, text) => `[${text}](${COLOR_LINK_PROTOCOL}${color.trim()})`);
    })
    .join('');
};

// Mismo mecanismo que preprocessColorTags: {copy}texto{/copy} -> [texto](copy:), el
// renderer de "a" de abajo lo intercepta y lo convierte en un <span> con un CopyButton
// al lado (el mismo que ya usan los bloques de código y los títulos), sin afectar esos
// otros copiables existentes.
const preprocessCopyTags = (markdown) => {
  if (typeof markdown !== 'string' || !markdown.includes('{copy}')) return markdown;

  return markdown
    .split(CODE_SPAN_PATTERN)
    .map((segment, index) => {
      const isCodeSpan = index % 2 === 1;
      if (isCodeSpan) return segment;
      return segment.replace(COPY_TAG_PATTERN, (_, text) => `[${text}](${COPY_LINK_PROTOCOL})`);
    })
    .join('');
};

// react-markdown sanea los href por default (defaultUrlTransform) y solo permite un
// allowlist de protocolos (http/https/irc/mailto/xmpp) — tanto el protocolo "color:"
// custom de arriba como "data:" (usado por MarkdownEditor para imágenes pegadas del
// portapapeles, convertidas a base64) quedan vacíos sin este urlTransform propio.
// Se restringe a "data:image/" (no cualquier data: URI) para no abrir la puerta a
// data:text/html u otros tipos de contenido potencialmente peligrosos en un href/src.
const DATA_IMAGE_PROTOCOL_PATTERN = /^data:image\//i;
const urlTransform = (url) => {
  if (url.startsWith(COLOR_LINK_PROTOCOL) || url === COPY_LINK_PROTOCOL || DATA_IMAGE_PROTOCOL_PATTERN.test(url)) return url;
  return defaultUrlTransform(url);
};

// Una línea que es ÚNICAMENTE una URL http(s) (nada de texto alrededor) se trata como
// imagen pegada directamente, sin que el usuario tenga que escribir ![alt](url) a mano —
// a propósito no se exige extensión de archivo reconocible (.png/.jpg/...), porque las
// URLs de imagen que da Google Images (gstatic.com/images?q=...) u otros servicios no
// siempre la tienen. Si la URL en realidad no es una imagen, el renderer de "img" de
// abajo cae a un link clickeable normal vía onError (ver IMAGE_FALLBACK_LINK_PROTOCOL).
const BARE_IMAGE_URL_LINE_PATTERN = /^(https?:\/\/\S+)$/gm;

const preprocessBareImageUrls = (markdown) => {
  if (typeof markdown !== 'string') return markdown;

  return markdown
    .split(CODE_SPAN_PATTERN)
    .map((segment, index) => {
      const isCodeSpan = index % 2 === 1;
      if (isCodeSpan) return segment;
      return segment.replace(BARE_IMAGE_URL_LINE_PATTERN, (url) => `![](${url})`);
    })
    .join('');
};

// Token corto que MarkdownEditor inserta en vez del base64 completo al pegar una
// captura (ver usePasteImage/paste handler ahí) — evita mostrar un string base64
// gigante en el textarea. `images` (prop de MarkdownContent, id -> url/base64) resuelve
// cada token a la imagen real antes de renderizar; sin ese mapa, el token se deja como
// texto literal (ej. si el consumidor guardó el base64 en su storage y todavía no
// reemplazó el token por la URL final).
const IMAGE_TOKEN_PATTERN = /\[imagen:([a-zA-Z0-9_-]+)\]/g;

const resolveImageTokens = (markdown, images) => {
  if (typeof markdown !== 'string' || !images || !markdown.includes('[imagen:')) return markdown;

  return markdown
    .split(CODE_SPAN_PATTERN)
    .map((segment, index) => {
      const isCodeSpan = index % 2 === 1;
      if (isCodeSpan) return segment;
      return segment.replace(IMAGE_TOKEN_PATTERN, (match, id) => (images[id] ? `![](${images[id]})` : match));
    })
    .join('');
};

const getPlainText = (node) => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getPlainText).join('');
  if (node.props?.children != null) return getPlainText(node.props.children);
  return '';
};

const createCodeRenderer = (UserCode) =>
  function CodeRenderer(props) {
    const { className, children } = props;

    if (isMermaidLanguage(className)) {
      return <MermaidBlock code={String(children).replace(/\n$/, '')} />;
    }

    if (UserCode) {
      return <UserCode {...props} />;
    }

    return <code className={className}>{children}</code>;
  };

const createPreRenderer = (UserPre, copyCodeLabel, copiedCodeLabel) =>
  function PreRenderer(props) {
    const { children } = props;
    const childClassName = children?.props?.className;

    if (isMermaidLanguage(childClassName)) {
      return children;
    }

    if (UserPre) {
      return <UserPre {...props} />;
    }

    return (
      <div className={styles.codeBlockWrapper}>
        <CopyButton
          text={getPlainText(children)}
          className={styles.codeCopyButton}
          label={copyCodeLabel}
          copiedLabel={copiedCodeLabel}
        />
        <pre>{children}</pre>
      </div>
    );
  };

const createCopyBlockRenderer = (blocks, copyTextLabel, copiedTextLabel) =>
  function CopyBlockRenderer(props) {
    const { node, children, 'data-copy-block': blockId, ...rest } = props;

    return (
      <div className={styles.copyBlockWrapper} {...rest}>
        <CopyButton
          text={blocks[blockId] ?? ''}
          className={styles.copyBlockButton}
          label={copyTextLabel}
          copiedLabel={copiedTextLabel}
        />
        {children}
      </div>
    );
  };

const createHeadingRenderer = (Tag, UserHeading, copyTitleLabel, copiedTitleLabel) =>
  function HeadingRenderer(props) {
    const { children, className = '', ...rest } = props;

    if (UserHeading) {
      return <UserHeading {...props} />;
    }

    return (
      <Tag className={`${className} ${styles.headingWithCopy}`.trim()} {...rest}>
        <span className={styles.headingText}>{children}</span>
        <CopyButton
          text={getPlainText(children)}
          className={styles.headingCopyButton}
          label={copyTitleLabel}
          copiedLabel={copiedTitleLabel}
        />
      </Tag>
    );
  };

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const createImageRenderer = (UserImage) =>
  function ImageRenderer(props) {
    const { src, alt, ...rest } = props;
    const [failed, setFailed] = useState(false);

    // Fallback para URLs sin extensión reconocible, autodetectadas como imagen por
    // preprocessBareImageUrls (ej. links de Google Images): si en realidad no eran una
    // imagen y la carga falla, se muestra un link clickeable normal en vez de un ícono
    // de imagen rota.
    if (failed) {
      return <a href={src} target="_blank" rel="noopener noreferrer">{alt || src}</a>;
    }

    if (UserImage) {
      return <UserImage src={src} alt={alt} {...rest} />;
    }

    return <img src={src} alt={alt} onError={() => setFailed(true)} {...rest} />;
  };

const createLinkRenderer = (UserLink, copyTextLabel, copiedTextLabel) =>
  function LinkRenderer(props) {
    const { href, children, ...rest } = props;

    if (typeof href === 'string' && href.startsWith(COLOR_LINK_PROTOCOL)) {
      const color = href.slice(COLOR_LINK_PROTOCOL.length);
      return <span style={{ color }}>{children}</span>;
    }

    if (href === COPY_LINK_PROTOCOL) {
      return (
        <span className={styles.copyableText}>
          {children}
          <CopyButton
            text={getPlainText(children)}
            className={styles.copyableTextButton}
            label={copyTextLabel}
            copiedLabel={copiedTextLabel}
          />
        </span>
      );
    }

    if (UserLink) {
      return <UserLink href={href} {...rest}>{children}</UserLink>;
    }

    return <a href={href} {...rest}>{children}</a>;
  };

export const MarkdownContent = ({
  children,
  className = '',
  style,
  components,
  linkColor,
  images,
  copyCodeLabel = 'Copiar código',
  copiedCodeLabel = 'Código copiado',
  copyTitleLabel = 'Copiar título',
  copiedTitleLabel = 'Título copiado',
  copyTextLabel = 'Copiar',
  copiedTextLabel = 'Copiado',
}) => {
  const { markdown: withoutCopyBlocks, blocks: copyBlocks } = extractCopyBlocks(children ?? '');

  const mergedComponents = {
    ...components,
    code: createCodeRenderer(components?.code),
    pre: createPreRenderer(components?.pre, copyCodeLabel, copiedCodeLabel),
    a: createLinkRenderer(components?.a, copyTextLabel, copiedTextLabel),
    img: createImageRenderer(components?.img),
    div: (props) =>
      props['data-copy-block']
        ? createCopyBlockRenderer(copyBlocks, copyTextLabel, copiedTextLabel)(props)
        : components?.div
          ? <components.div {...props} />
          : <div {...props} />,
    ...Object.fromEntries(
      HEADING_TAGS.map((tag) => [
        tag,
        createHeadingRenderer(tag, components?.[tag], copyTitleLabel, copiedTitleLabel),
      ])
    ),
  };

  const processedMarkdown = preprocessCopyTags(
    preprocessColorTags(
      preprocessBareImageUrls(resolveImageTokens(withoutCopyBlocks, images))
    )
  );

  return (
    <div
      className={`${styles.markdown} ${className}`}
      style={{ ...(linkColor ? { '--markdown-link': linkColor } : {}), ...style }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkCopyBlocks]} components={mergedComponents} urlTransform={urlTransform}>
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
