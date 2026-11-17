import React, { useState } from 'react';
import { Paperclip, Smile } from 'lucide-react';
import RichChatInput from './index';

export default {
  title: 'Components/RichChatInput',
  component: RichChatInput,
};

// Caso base: escribí `**negrita**`, `*cursiva*`, `~~tachado~~` o `código` entre backticks y se
// renderiza al cerrar el marcador; también con la barra o Ctrl+B / I / E / K / Shift+X.
export const Default = {
  render: () => {
    const [value, setValue] = useState('');
    const [enviados, setEnviados] = useState([]);
    return (
      <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <RichChatInput
          value={value}
          onChange={setValue}
          onSend={(text) => {
            setEnviados((prev) => [...prev, text]);
            setValue('');
          }}
        />
        <div>
          <strong>Markdown:</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(value)}</pre>
          <strong>Enviados:</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{enviados.join('\n---\n')}</pre>
        </div>
      </div>
    );
  },
};

// `value` inicial en markdown: se carga ya renderizado.
export const WithInitialValue = {
  render: () => {
    const [value, setValue] = useState('Hola **equipo**, revisen `pnpm build` y ~~el plan viejo~~ el [nuevo plan](https://example.com).\nSegunda _línea_.');
    return (
      <div style={{ maxWidth: 560 }}>
        <RichChatInput value={value} onChange={setValue} onSend={() => setValue('')} />
      </div>
    );
  },
};

// Solo algunas herramientas y Ctrl+Enter para enviar (Enter = salto de línea).
export const CustomTools = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: 560 }}>
        <RichChatInput
          value={value}
          onChange={setValue}
          onSend={() => setValue('')}
          tools={['bold', 'italic', 'code']}
          sendShortcut="ctrl+enter"
          sendLabel="Enviar (Ctrl+Enter)"
          minRows={3}
          maxRows={6}
          placeholder="Solo negrita, cursiva y código…"
        />
      </div>
    );
  },
};

// Botones propios en la barra (mismo formato de items que ChatComposer) y colores personalizados.
export const ExtraToolsAndColors = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: 560 }}>
        <RichChatInput
          value={value}
          onChange={setValue}
          onSend={() => setValue('')}
          extraTools={[
            { type: 'separator', key: 'sep' },
            { type: 'icon', key: 'adjuntar', icon: Paperclip, tooltip: 'Adjuntar', onClick: () => {} },
            { type: 'icon', key: 'emoji', icon: Smile, tooltip: 'Emojis', onClick: () => {} },
          ]}
          bgColor="#0f172a"
          borderColor="#334155"
          textColor="#e2e8f0"
          placeholderColor="#64748b"
          toolbarBgColor="#1e293b"
          toolbarBorderColor="#334155"
          codeBgColor="rgba(255,255,255,0.12)"
          linkColor="#7dd3fc"
          sendColor="#7c9cff"
        />
      </div>
    );
  },
};

// Pegado de imágenes (Ctrl+V): aparecen como chips y `onSend` las recibe en el 2º argumento.
export const WithImagePaste = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: 560 }}>
        <RichChatInput
          value={value}
          onChange={setValue}
          onImagePaste={(files) => console.log('imágenes', files)}
          onSend={(text, files) => {
            console.log('enviar', text, files);
            setValue('');
          }}
        />
      </div>
    );
  },
};

// Barra abajo, junto al botón de enviar.
export const ToolbarBottom = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: 560 }}>
        <RichChatInput value={value} onChange={setValue} onSend={() => setValue('')} toolbarPosition="bottom" />
      </div>
    );
  },
};

export const Disabled = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <RichChatInput value="No se puede **editar**" disabled />
    </div>
  ),
};
