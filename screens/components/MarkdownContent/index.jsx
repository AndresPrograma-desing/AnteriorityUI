import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './index.module.css';

export const MarkdownContent = ({ children, className = '', style, components, linkColor }) => (
  <div
    className={`${styles.markdown} ${className}`}
    style={{ ...(linkColor ? { '--markdown-link': linkColor } : {}), ...style }}
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children ?? ''}
    </ReactMarkdown>
  </div>
);

export default MarkdownContent;
