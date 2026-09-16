import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './index.module.css';
import { MermaidBlock } from './MermaidBlock';

const isMermaidLanguage = (className = '') => /(^|\s)language-mermaid(\s|$)/.test(className);

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

const createPreRenderer = (UserPre) =>
  function PreRenderer(props) {
    const { children } = props;
    const childClassName = children?.props?.className;

    if (isMermaidLanguage(childClassName)) {
      return children;
    }

    if (UserPre) {
      return <UserPre {...props} />;
    }

    return <pre>{children}</pre>;
  };

export const MarkdownContent = ({ children, className = '', style, components, linkColor }) => {
  const mergedComponents = {
    ...components,
    code: createCodeRenderer(components?.code),
    pre: createPreRenderer(components?.pre),
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
