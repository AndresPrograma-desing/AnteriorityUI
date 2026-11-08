import QRCodeLib from 'qrcode';
import { DEFAULT_LEVEL, LOGO_LEVEL } from './constants.js';

// Devuelve { size, data } (data: array plano de 0/1) o lanza si el texto no cabe en un QR.
export function buildMatrix(value, level = DEFAULT_LEVEL, hasLogo = false) {
  const qr = QRCodeLib.create(String(value), { errorCorrectionLevel: hasLogo ? LOGO_LEVEL : level });
  return { size: qr.modules.size, data: qr.modules.data };
}

// Un módulo está dentro de uno de los 3 "finder patterns" (esquinas): se dibujan siempre cuadrados.
export function isFinder(x, y, size) {
  return (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
}

// Copia los estilos computados al clon para que el contenido HTML del logo (foreignObject:
// Avatar, íconos con CSS Modules, etc.) se vea igual al exportar, ya que el SVG suelto no tiene hojas de estilo.
function inlineStyles(orig, clone) {
  const cs = window.getComputedStyle(orig);
  let css = '';
  for (let i = 0; i < cs.length; i++) css += `${cs[i]}:${cs.getPropertyValue(cs[i])};`;
  clone.setAttribute('style', css);
  for (let i = 0; i < orig.children.length; i++) inlineStyles(orig.children[i], clone.children[i]);
}

export function serializeSvg(svgEl) {
  const clone = svgEl.cloneNode(true);
  const origFos = svgEl.querySelectorAll('foreignObject');
  clone.querySelectorAll('foreignObject').forEach((fo, i) => {
    for (let k = 0; k < origFos[i].children.length; k++) inlineStyles(origFos[i].children[k], fo.children[k]);
  });
  return new XMLSerializer().serializeToString(clone);
}

export function svgToPngBlob(svgEl, pixelSize) {
  return new Promise((resolve, reject) => {
    const xml = serializeSvg(svgEl);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelSize;
      canvas.height = pixelSize;
      canvas.getContext('2d').drawImage(img, 0, 0, pixelSize, pixelSize);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
    };
    img.onerror = () => reject(new Error('No se pudo rasterizar el QR'));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  });
}
