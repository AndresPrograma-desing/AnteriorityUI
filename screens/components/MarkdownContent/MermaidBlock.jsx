import { useEffect, useId, useRef, useState } from 'react';
import styles from './index.module.css';

let mermaidPromise;
const loadMermaid = () => {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      const mermaid = mod.default ?? mod;
      mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'strict' });
      return mermaid;
    });
  }
  return mermaidPromise;
};

export const MermaidBlock = ({ code }) => {
  const id = useId().replace(/:/g, '-');
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    loadMermaid()
      .then((mermaid) => mermaid.render(`mermaid-${id}`, code))
      .then(({ svg }) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Error al renderizar el diagrama');
      });

    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return <pre className={styles.mermaidError}>{error}</pre>;
  }

  return <div className={styles.mermaidBlock} ref={containerRef} />;
};

export default MermaidBlock;
