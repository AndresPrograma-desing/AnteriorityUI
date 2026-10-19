import React, { useState } from 'react';
import { Search } from 'lucide-react';
import styles from './index.module.css';

// Parsea "mm:ss", "hh:mm:ss" o segundos sueltos ("90") a segundos totales.
// Devuelve null si el texto no matchea ninguno de esos formatos.
function parseTimeInput(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  if (/^\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);

  const parts = trimmed.split(':').map((part) => part.trim());
  if (parts.length < 2 || parts.length > 3 || parts.some((part) => !/^\d+$/.test(part))) return null;

  const numbers = parts.map(Number);
  if (numbers.length === 2) {
    const [mins, secs] = numbers;
    return mins * 60 + secs;
  }
  const [hrs, mins, secs] = numbers;
  return hrs * 3600 + mins * 60 + secs;
}

// Input de texto para saltar a un punto específico del video (ej. "1:23" o "90").
const VideoTimeSearch = ({ duration, onSeek, controlsColor }) => {
  const [value, setValue] = useState('');
  const [invalid, setInvalid] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsed = parseTimeInput(value);
    if (parsed == null || parsed < 0) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    onSeek(Math.min(parsed, duration || parsed));
    setValue('');
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <Search size={14} style={{ color: controlsColor || '#9ba1ae' }} />
      <input
        type="text"
        className={`${styles.searchInput} ${invalid ? styles.searchInputInvalid : ''}`}
        placeholder="mm:ss"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setInvalid(false);
        }}
        style={{ color: controlsColor || '#f1f3f6' }}
        aria-label="Buscar tiempo en el video"
      />
    </form>
  );
};

export default VideoTimeSearch;
