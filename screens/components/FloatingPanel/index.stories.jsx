import React, { useState } from 'react';
import FloatingPanel from './index';
import Button from '../Button/index';

export default {
  title: 'Components/FloatingPanel',
  component: FloatingPanel,
};

// Panel libre: mover, redimensionar y cerrar; el contenido es cualquiera.
export const Libre = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ minHeight: 360 }}>
        <Button onClick={() => setOpen(true)}>Abrir panel</Button>
        {open && (
          <FloatingPanel
            title="Vista previa"
            subtitle="contrato.pdf"
            defaultPosition={{ left: 120, top: 120 }}
            width={320}
            height={220}
            onClose={() => setOpen(false)}
          >
            <p>Este panel muestra cualquier contenido: texto, formularios, tablas o un iframe.</p>
          </FloatingPanel>
        )}
      </div>
    );
  },
};

// Anclado a un elemento: se ubica junto a él y lo sigue al scrollear. Arrastrarlo lo suelta; la chincheta lo vuelve a anclar.
export const AncladoAElemento = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: 16 }}>
      <button id="fp-ancla" type="button" style={{ padding: '8px 14px' }}>
        Botón de referencia
      </button>
      <FloatingPanel
        title="Detalle"
        getAnchorRect={() => {
          const el = document.getElementById('fp-ancla');
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
        }}
        width={260}
        height={160}
      >
        <p>Se ubica junto al botón de la izquierda.</p>
      </FloatingPanel>
    </div>
  ),
};

// Sin encabezado ni botones: solo el contenido en una caja flotante (no arrastrable ni cerrable).
export const SinEncabezado = {
  render: () => (
    <FloatingPanel defaultPosition={{ left: 80, top: 80 }} width={240} height={120} draggable={false} resizable={false}>
      <strong>Aviso fijo</strong>
      <p>Caja flotante sin encabezado.</p>
    </FloatingPanel>
  ),
};

// Colores personalizados por props (no hace falta CSS externo).
export const ColoresPersonalizados = {
  render: () => (
    <FloatingPanel
      title="Resultado"
      defaultPosition={{ left: 80, top: 80 }}
      width={260}
      height={150}
      bgColor="#eef2ff"
      headerBgColor="#c7d2fe"
      borderColor="#818cf8"
      textColor="#312e81"
      accentColor="#4f46e5"
      onClose={() => {}}
    >
      <p>Panel con paleta propia.</p>
    </FloatingPanel>
  ),
};
