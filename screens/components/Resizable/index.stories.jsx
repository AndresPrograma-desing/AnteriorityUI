import React, { useState } from 'react';
import Resizable from './index';

export default {
  title: 'Components/Resizable',
  component: Resizable,
  argTypes: {
    direction: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    handlePosition: { control: 'inline-radio', options: ['end', 'start'] },
  },
};

const panelStyle = {
  height: '100%',
  padding: 16,
  background: '#0f172a',
  color: '#e2e8f0',
  fontFamily: 'monospace',
  fontSize: 13,
  boxSizing: 'border-box',
};

// Panel inferior tipo terminal de VS Code: se agranda hacia arriba.
export const PanelInferior = {
  args: { direction: 'vertical', handlePosition: 'start', defaultSize: 200, minSize: 80, maxSize: 480 },
  render: (args) => (
    <div style={{ height: 420, display: 'flex', flexDirection: 'column', background: '#1e293b' }}>
      <div style={{ flex: 1, padding: 16, color: '#94a3b8' }}>Área de trabajo</div>
      <Resizable {...args}>
        <div style={panelStyle}>$ npm run build<br />Build OK</div>
      </Resizable>
    </div>
  ),
};

// Sidebar lateral que se agranda hacia la derecha.
export const SidebarHorizontal = {
  args: { direction: 'horizontal', handlePosition: 'end', defaultSize: 220, minSize: 120, maxSize: 400 },
  render: (args) => (
    <div style={{ height: 300, display: 'flex', border: '1px solid #cbd5e1' }}>
      <Resizable {...args} style={{ height: '100%' }}>
        <div style={{ ...panelStyle, background: '#f1f5f9', color: '#0f172a' }}>Menú lateral</div>
      </Resizable>
      <div style={{ flex: 1, padding: 16 }}>Contenido</div>
    </div>
  ),
};

// Tamaño controlado: el consumidor recibe cada cambio y puede guardarlo (ej. en localStorage).
// Ajuste fino: pasá el puntero sobre la franja y usá las flechas (1 px; Shift = 10 px; Home/End = límites).
export const Controlado = {
  render: () => {
    const [size, setSize] = useState(180);
    return (
      <div>
        <p style={{ margin: '0 0 8px' }}>Alto actual: {size}px</p>
        <div style={{ height: 320, display: 'flex', flexDirection: 'column', border: '1px solid #cbd5e1' }}>
          <div style={{ flex: 1, padding: 16 }}>Arriba</div>
          <Resizable size={size} onSizeChange={setSize} minSize={60} maxSize={300} handleSize={10}>
            <div style={{ ...panelStyle, height: 'auto', minHeight: '100%' }}>Abajo</div>
          </Resizable>
        </div>
      </div>
    );
  },
};

// Colores del handle por prop (sin CSS externo).
export const ColoresPersonalizados = {
  args: {
    direction: 'vertical',
    handlePosition: 'start',
    defaultSize: 160,
    handleBgColor: '#1e1b4b',
    lineColor: '#312e81',
    lineActiveColor: '#a5b4fc',
    gripBorderColor: '#818cf8',
    gripIconColor: '#c7d2fe',
    gripBgColor: '#1e1b4b',
  },
  render: (args) => (
    <div style={{ height: 320, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, background: '#eef2ff', padding: 16 }}>Arriba</div>
      <Resizable {...args}>
        <div style={{ ...panelStyle, background: '#1e1b4b' }}>Panel violeta</div>
      </Resizable>
    </div>
  ),
};

// Referencia de diseño: franja fina y grip cuadrado con flechas. Cambiar `gripIcon` o `lineThickness`
// para otro estilo; `showGrip: false` deja solo la línea.
export const FranjaYGrip = {
  args: { direction: 'horizontal', handlePosition: 'end', defaultSize: 200, lineThickness: 1, gripSize: 22, gripRadius: 4 },
  render: (args) => (
    <div style={{ height: 240, display: 'flex', border: '1px solid #cbd5e1' }}>
      <Resizable {...args} style={{ height: '100%' }}>
        <div style={{ ...panelStyle, background: '#f8fafc', color: '#0f172a' }}>Panel</div>
      </Resizable>
      <div style={{ flex: 1, padding: 16 }}>Contenido</div>
    </div>
  ),
};

export const SinHandle = {
  args: { direction: 'vertical', defaultSize: 120, showHandle: false },
  render: (args) => (
    <Resizable {...args}>
      <div style={panelStyle}>Sin handle: el tamaño queda fijo (controlado por el consumidor)</div>
    </Resizable>
  ),
};
