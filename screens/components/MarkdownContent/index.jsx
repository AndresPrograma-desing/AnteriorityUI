import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './index.module.css';
import { MermaidBlock } from './MermaidBlock';
import { CopyButton } from './CopyButton';

const isMermaidLanguage = (className = '') => /(^|\s)language-mermaid(\s|$)/.test(className);

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

export const MarkdownContent = ({
  children,
  className = '',
  style,
  components,
  linkColor,
  copyCodeLabel = 'Copiar código',
  copiedCodeLabel = 'Código copiado',
  copyTitleLabel = 'Copiar título',
  copiedTitleLabel = 'Título copiado',
}) => {
  const mergedComponents = {
    ...components,
    code: createCodeRenderer(components?.code),
    pre: createPreRenderer(components?.pre, copyCodeLabel, copiedCodeLabel),
    ...Object.fromEntries(
      HEADING_TAGS.map((tag) => [
        tag,
        createHeadingRenderer(tag, components?.[tag], copyTitleLabel, copiedTitleLabel),
      ])
    ),
  };

  return (
    <div
      className={`${styles.markdown} ${className}`}
      style={{ ...(linkColor ? { '--markdown-link': linkColor } : {}), ...style }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mergedComponents}>
        {children ?? ''}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
