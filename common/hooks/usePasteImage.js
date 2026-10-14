import { useCallback, useEffect, useRef, useState } from 'react';

// Identifica un File por contenido/origen (no por referencia) para poder
// descartar imágenes ya pegadas antes. name+size+lastModified+type coincide
// exactamente para el mismo archivo pegado dos veces, y es suficientemente
// preciso para distinguir archivos distintos sin tener que hashear bytes.
const fingerprintFile = (file) => `${file.name}|${file.size}|${file.lastModified}|${file.type}`;

// Hook genérico para extraer imágenes pegadas (Ctrl+V) desde el clipboard de
// un evento `paste`, sin acoplarse a ningún input en particular. Cualquier
// componente de texto puede usarlo pasando su handler como `onPaste`, o
// envolverse con `PasteImageField` (screens/components/PasteImageField), que
// ya lo integra y agrega preview visual. Si el clipboard trae varias imágenes
// a la vez, se extraen todas (ninguna se descarta en silencio); una imagen
// ya pegada antes (mismo archivo) se ignora para no duplicarla.
const usePasteImage = ({ onImagePaste, disabled = false } = {}) => {
  const [previews, setPreviews] = useState([]);
  const previewsRef = useRef([]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, []);

  const clearPreview = useCallback((id) => {
    setPreviews((current) => {
      const target = current.find((preview) => preview.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((preview) => preview.id !== id);
    });
  }, []);

  const clearAllPreviews = useCallback(() => {
    setPreviews((current) => {
      current.forEach((preview) => URL.revokeObjectURL(preview.url));
      return [];
    });
  }, []);

  const onPaste = useCallback((event) => {
    if (disabled) return;

    const items = event.clipboardData?.items;
    if (!items) return;

    const pastedFiles = Array.from(items)
      .filter((item) => item.type?.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter(Boolean);

    if (pastedFiles.length === 0) return;

    // Evita que el navegador además pegue un fragmento de texto/base64 en el input.
    event.preventDefault();

    const existingFingerprints = new Set(previewsRef.current.map((preview) => preview.fingerprint));
    const seenInThisPaste = new Set();
    const imageFiles = pastedFiles.filter((file) => {
      const fingerprint = fingerprintFile(file);
      if (existingFingerprints.has(fingerprint) || seenInThisPaste.has(fingerprint)) return false;
      seenInThisPaste.add(fingerprint);
      return true;
    });

    if (imageFiles.length === 0) return;

    const newPreviews = imageFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      file,
      fingerprint: fingerprintFile(file),
    }));
    setPreviews((current) => [...current, ...newPreviews]);

    onImagePaste?.(imageFiles, event);
  }, [disabled, onImagePaste]);

  return { onPaste, previews, clearPreview, clearAllPreviews };
};

export default usePasteImage;
