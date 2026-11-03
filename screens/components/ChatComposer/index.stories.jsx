import React, { useState } from 'react';
import { Paperclip, Smile, Zap, FileText, Sparkles, Plus, Type, AtSign, Clock, Bookmark, Trash2 } from 'lucide-react';
import ChatComposer from './index';
import Barnner from '../Barnner/index';

export default {
  title: 'Components/ChatComposer',
  component: ChatComposer,
};

const textoEjemplo = '**Hola**, probá `código` y una lista:\n\n- Opción A\n- Opción B\n\n[Documentación](https://example.com)';

// Caso base: barra con botones de distintos tipos, Markdown por defecto y envío con Enter.
export const Default = {
  render: () => {
    const [value, setValue] = useState(textoEjemplo);
    const [enviados, setEnviados] = useState([]);
    const [rapido, setRapido] = useState(false);
    const toolbar = [
      { type: 'icon', key: 'adjuntar', icon: Paperclip, tooltip: 'Adjuntar archivo', onClick: () => console.log('adjuntar') },
      { type: 'icon', key: 'emoji', icon: Smile, tooltip: 'Emojis', onClick: () => console.log('emoji') },
      { type: 'separator', key: 'sep1' },
      { type: 'toggle', key: 'rapido', label: 'Modo rápido', icon: Zap, active: rapido, onClick: () => setRapido((r) => !r) },
      { type: 'button', key: 'plantilla', label: 'Plantilla', icon: FileText, onClick: () => setValue('Resumí el documento en 3 puntos.') },
      { type: 'spacer', key: 'espacio' },
      { type: 'custom', key: 'modelo', node: <Barnner type="success">Modelo: rápido</Barnner> },
    ];
    const footerToolbar = [
      { type: 'icon', key: 'mas', icon: Plus, tooltip: 'Agregar', onClick: () => {} },
      { type: 'icon', key: 'formato', icon: Type, tooltip: 'Formato', onClick: () => {} },
      { type: 'icon', key: 'emoji', icon: Smile, tooltip: 'Emojis', onClick: () => {} },
      { type: 'icon', key: 'mencion', icon: AtSign, tooltip: 'Mencionar', onClick: () => {} },
    ];
    return (
      <div style={{ maxWidth: 560 }}>
        <ChatComposer
          value={value}
          onChange={setValue}
          onSend={(text) => {
            setEnviados((prev) => [...prev, text]);
            setValue('');
          }}
          toolbar={toolbar}
          footerToolbar={footerToolbar}
        />
        <div style={{ marginTop: 12, fontSize: 13 }}>
          Enviados: {enviados.length}
          {enviados.map((text, i) => (
            <pre key={i} style={{ whiteSpace: 'pre-wrap', margin: '6px 0' }}>{text}</pre>
          ))}
        </div>
      </div>
    );
  },
};

// Imágenes: al pegar una (Ctrl+V) aparece el preview ARRIBA del campo. onImagePaste recibe los File.
export const ConPegadoDeImagenes = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: 560 }}>
        <ChatComposer
          value={value}
          onChange={setValue}
          onImagePaste={(files) => console.log('imágenes pegadas', files)}
          onSend={() => setValue('')}
          placeholder="Pegá una imagen con Ctrl+V…"
        />
      </div>
    );
  },
};

// Sin vista previa de Markdown ni botón de envío (solo la barra y el campo).
export const SinVistaPreviaNiEnvio = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: 560 }}>
        <ChatComposer
          value={value}
          onChange={setValue}
          previewToggle={false}
          showSend={false}
          toolbar={[{ type: 'button', key: 'x', label: 'Acción', onClick: () => {} }]}
        />
      </div>
    );
  },
};

// Colores por prop (tema oscuro): fondo, bordes, texto, barra y botón de envío.
export const TemaOscuro = {
  render: () => {
    const [value, setValue] = useState('Probá la **vista previa** del tema oscuro.');
    return (
      <div style={{ maxWidth: 560, background: '#0b1020', padding: 16, borderRadius: 12 }}>
        <ChatComposer
          value={value}
          onChange={setValue}
          bgColor="#111827"
          borderColor="#334155"
          textColor="#e2e8f0"
          toolbarBgColor="#0f172a"
          toolbarBorderColor="#334155"
          inputBgColor="#111827"
          sendColor="#7c3aed"
          toolbar={[
            { type: 'toggle', key: 'ia', label: 'IA', icon: Sparkles, active: true, activeColor: '#4c1d95', color: '#c4b5fd' },
            { type: 'icon', key: 'adjuntar', icon: Paperclip, color: '#94a3b8' },
          ]}
        />
      </div>
    );
  },
};

// Botón de envío con menú: el chevron al lado abre un popover con acciones extra.
// Cada acción recibe el texto actual en onClick(texto).
export const ConMenuDeEnvio = {
  render: () => {
    const [value, setValue] = useState('Mensaje para programar o guardar como borrador');
    const [log, setLog] = useState('');
    return (
      <div style={{ maxWidth: 560 }}>
        <ChatComposer
          value={value}
          onChange={setValue}
          onSend={() => { setLog('Enviado'); setValue(''); }}
          sendMenu={[
            { key: 'programar', label: 'Programar envío', icon: Clock, onClick: (texto) => setLog(`Programado: ${texto}`) },
            { key: 'borrador', label: 'Guardar borrador', icon: Bookmark, onClick: (texto) => setLog(`Borrador: ${texto}`) },
            { key: 'limpiar', label: 'Descartar', icon: Trash2, disabled: !value, onClick: () => setValue('') },
          ]}
        />
        <div style={{ marginTop: 12, fontSize: 13 }}>Última acción: {log || '—'}</div>
      </div>
    );
  },
};

// Props de los hijos expuestas por el composer: spinner en el envío, tamaño del botón,
// variante del textarea y foco desde afuera con ref.
export const ConPropsDeHijos = {
  render: () => {
    const [value, setValue] = useState('');
    const [enviando, setEnviando] = useState(false);
    const campoRef = React.useRef(null);
    return (
      <div style={{ maxWidth: 560 }}>
        <ChatComposer
          ref={campoRef}
          value={value}
          onChange={setValue}
          sendLoading={enviando}
          sendButtonProps={{ size: 'large' }}
          textareaProps={{ variant: 'standard', autoFocus: true }}
          onSend={() => {
            setEnviando(true);
            setTimeout(() => {
              setEnviando(false);
              setValue('');
              campoRef.current?.focus();
            }, 1200);
          }}
        />
        <div style={{ marginTop: 12, fontSize: 13 }}>Al enviar muestra el spinner y devuelve el foco al campo.</div>
      </div>
    );
  },
};
