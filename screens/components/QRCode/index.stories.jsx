import React, { useState } from 'react';
import QRCode from './index';
import Input from '../Input/index';
import Button from '../Button/index';
import Avatar from '../Avatar/index';
import { Wifi } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default {
  title: 'Components/QRCode',
  component: QRCode,
};

export const Default = { args: { value: 'https://example.com', size: 220 } };

export const Descargable = {
  args: { value: 'https://example.com/ticket/123', downloadable: true, fileName: 'ticket-123' },
};

export const Colores = {
  args: { value: 'https://example.com', fgColor: '#4f46e5', bgColor: '#eef2ff', borderColor: '#c7d2fe' },
};

export const ConMarco = {
  args: {
    value: 'https://example.com',
    borderColor: '#4f46e5',
    borderWidth: 3,
    borderRadius: 16,
    padding: 12,
    frameBgColor: '#eef2ff',
  },
};

export const Cargando = { args: { value: 'https://example.com', loading: true } };

export const Difuminado = { args: { value: 'https://example.com', blurred: true } };

export const DifuminadoConTexto = {
  args: { value: 'https://example.com', blurred: true, blurOverlay: <strong>QR oculto</strong> },
};

export const EntradaYSalida = {
  render: () => {
    const [visible, setVisible] = useState(true);
    const [animation, setAnimation] = useState('scale');
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" onClick={() => setVisible((v) => !v)}>{visible ? 'Ocultar' : 'Mostrar'}</Button>
          {['scale', 'fade', 'slide'].map((a) => (
            <Button key={a} size="small" variant="outline" onClick={() => setAnimation(a)}>{a}</Button>
          ))}
        </div>
        <QRCode value="https://example.com" visible={visible} animation={animation} />
      </div>
    );
  },
};

export const FlujoCompleto = {
  render: () => {
    const [state, setState] = useState('loading');
    React.useEffect(() => {
      if (state !== 'loading') return undefined;
      const t = setTimeout(() => setState('blurred'), 2000);
      return () => clearTimeout(t);
    }, [state]);
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <QRCode
          value="https://example.com/pago/42"
          loading={state === 'loading'}
          blurred={state === 'blurred'}
          blurOverlay={<Button size="small" onClick={() => setState('shown')}>Mostrar QR</Button>}
          downloadable
        />
        <Button size="small" variant="outline" onClick={() => setState('loading')}>Reiniciar</Button>
      </div>
    );
  },
};

export const ModulosRedondeados = { args: { value: 'https://example.com', moduleStyle: 'rounded', fgColor: '#0f766e' } };

export const Puntos = { args: { value: 'https://example.com', moduleStyle: 'dots', fgColor: '#be123c' } };

const LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#4f46e5"/><text x="20" y="27" font-size="22" text-anchor="middle" fill="#fff" font-family="sans-serif">A</text></svg>',
  );

export const ConLogo = { args: { value: 'https://example.com', logo: LOGO, size: 260, downloadable: true } };

export const LogoIconoLucide = {
  args: { value: 'WIFI:T:WPA;S:MiRed;P:clave123;;', size: 240, logo: <Wifi color="#4f46e5" />, logoBgColor: '#eef2ff' },
};

export const LogoReactIcon = {
  args: { value: 'https://wa.me/5491112345678', size: 240, logo: <FaWhatsapp color="#25d366" /> },
};

export const LogoAvatar = {
  args: {
    value: 'https://example.com/perfil/ana',
    size: 260,
    downloadable: true,
    logo: (px) => <Avatar name="Ana" size={px} />,
  },
};

export const Interactivo = {
  render: () => {
    const [text, setText] = useState('https://example.com');
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Input
          label="Contenido del QR"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: 280 }}
        />
        <QRCode value={text} downloadable />
      </div>
    );
  },
};
