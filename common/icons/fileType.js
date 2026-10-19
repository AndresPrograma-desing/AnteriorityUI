// Mapeo global extensión -> { icon (react-icons), bgColor, label } usado por cualquier
// componente que necesite representar un archivo por su tipo (MediaViewer, FileListItem,
// futuros componentes de adjuntos/uploads). Única fuente de verdad: si se agrega soporte
// para una extensión nueva, se agrega acá y todos los consumidores lo heredan.
import {
  BsFileEarmarkPdfFill,
  BsFileEarmarkWordFill,
  BsFileEarmarkExcelFill,
  BsFileEarmarkPptFill,
  BsFileEarmarkZipFill,
  BsFileEarmarkMusicFill,
  BsFileEarmarkImageFill,
  BsFileEarmarkPlayFill,
  BsFileEarmarkCodeFill,
  BsFileEarmarkTextFill,
  BsFileEarmarkSpreadsheetFill,
  BsFileEarmarkFill,
  BsMarkdownFill,
} from 'react-icons/bs';

export const DEFAULT_FILE_TYPE = {
  icon: BsFileEarmarkFill,
  bgColor: '#475569',
  label: 'Archivo',
};

// Clave = extensión en minúscula (sin punto).
export const FILE_TYPE_MAP = {
  pdf: { icon: BsFileEarmarkPdfFill, bgColor: '#e3342f', label: 'PDF' },

  doc: { icon: BsFileEarmarkWordFill, bgColor: '#2b579a', label: 'Word' },
  docx: { icon: BsFileEarmarkWordFill, bgColor: '#2b579a', label: 'Word' },

  xls: { icon: BsFileEarmarkExcelFill, bgColor: '#217346', label: 'Excel' },
  xlsx: { icon: BsFileEarmarkExcelFill, bgColor: '#217346', label: 'Excel' },
  csv: { icon: BsFileEarmarkSpreadsheetFill, bgColor: '#217346', label: 'CSV' },

  ppt: { icon: BsFileEarmarkPptFill, bgColor: '#d24726', label: 'PowerPoint' },
  pptx: { icon: BsFileEarmarkPptFill, bgColor: '#d24726', label: 'PowerPoint' },

  zip: { icon: BsFileEarmarkZipFill, bgColor: '#78350f', label: 'Comprimido' },
  rar: { icon: BsFileEarmarkZipFill, bgColor: '#78350f', label: 'Comprimido' },
  '7z': { icon: BsFileEarmarkZipFill, bgColor: '#78350f', label: 'Comprimido' },

  md: { icon: BsMarkdownFill, bgColor: '#334155', label: 'Markdown' },
  txt: { icon: BsFileEarmarkTextFill, bgColor: '#475569', label: 'Texto' },
  json: { icon: BsFileEarmarkCodeFill, bgColor: '#854d0e', label: 'JSON' },
  js: { icon: BsFileEarmarkCodeFill, bgColor: '#854d0e', label: 'Código' },
  jsx: { icon: BsFileEarmarkCodeFill, bgColor: '#854d0e', label: 'Código' },
  ts: { icon: BsFileEarmarkCodeFill, bgColor: '#854d0e', label: 'Código' },
  tsx: { icon: BsFileEarmarkCodeFill, bgColor: '#854d0e', label: 'Código' },
  html: { icon: BsFileEarmarkCodeFill, bgColor: '#854d0e', label: 'Código' },
  css: { icon: BsFileEarmarkCodeFill, bgColor: '#854d0e', label: 'Código' },

  png: { icon: BsFileEarmarkImageFill, bgColor: '#7c3aed', label: 'Imagen' },
  jpg: { icon: BsFileEarmarkImageFill, bgColor: '#7c3aed', label: 'Imagen' },
  jpeg: { icon: BsFileEarmarkImageFill, bgColor: '#7c3aed', label: 'Imagen' },
  gif: { icon: BsFileEarmarkImageFill, bgColor: '#7c3aed', label: 'Imagen' },
  webp: { icon: BsFileEarmarkImageFill, bgColor: '#7c3aed', label: 'Imagen' },
  svg: { icon: BsFileEarmarkImageFill, bgColor: '#7c3aed', label: 'Imagen' },
  avif: { icon: BsFileEarmarkImageFill, bgColor: '#7c3aed', label: 'Imagen' },
  bmp: { icon: BsFileEarmarkImageFill, bgColor: '#7c3aed', label: 'Imagen' },

  mp4: { icon: BsFileEarmarkPlayFill, bgColor: '#0ea5e9', label: 'Video' },
  webm: { icon: BsFileEarmarkPlayFill, bgColor: '#0ea5e9', label: 'Video' },
  ogv: { icon: BsFileEarmarkPlayFill, bgColor: '#0ea5e9', label: 'Video' },
  mov: { icon: BsFileEarmarkPlayFill, bgColor: '#0ea5e9', label: 'Video' },
  mkv: { icon: BsFileEarmarkPlayFill, bgColor: '#0ea5e9', label: 'Video' },

  mp3: { icon: BsFileEarmarkMusicFill, bgColor: '#16a34a', label: 'Audio' },
  wav: { icon: BsFileEarmarkMusicFill, bgColor: '#16a34a', label: 'Audio' },
  oga: { icon: BsFileEarmarkMusicFill, bgColor: '#16a34a', label: 'Audio' },
  ogg: { icon: BsFileEarmarkMusicFill, bgColor: '#16a34a', label: 'Audio' },
  m4a: { icon: BsFileEarmarkMusicFill, bgColor: '#16a34a', label: 'Audio' },
  flac: { icon: BsFileEarmarkMusicFill, bgColor: '#16a34a', label: 'Audio' },
};

export function getExtension(value) {
  if (!value) return '';
  const clean = value.split('?')[0].split('#')[0];
  const parts = clean.split('.');
  if (parts.length < 2) return '';
  return parts[parts.length - 1].toLowerCase();
}

export function getFileTypeInfo(nameOrUrl) {
  const extension = getExtension(nameOrUrl);
  return FILE_TYPE_MAP[extension] || DEFAULT_FILE_TYPE;
}
