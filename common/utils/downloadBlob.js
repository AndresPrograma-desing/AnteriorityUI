// Descarga un Blob como archivo (link temporal con `download`). Revoca la URL recién después de un segundo para que
// el navegador alcance a iniciar la descarga.
export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default downloadBlob;
