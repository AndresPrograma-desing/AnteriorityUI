// Copia `text` al portapapeles. Usa la Clipboard API y, si no está disponible (http sin HTTPS, iframes sin
// permiso, navegadores viejos), cae a un <textarea> + execCommand('copy'). Devuelve true si copió.
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export default copyToClipboard;
