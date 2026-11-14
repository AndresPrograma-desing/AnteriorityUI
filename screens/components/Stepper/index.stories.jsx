import React, { useState } from 'react';
import { Building2, MapPin, Wrench } from 'lucide-react';
import Stepper from './index';

export default {
  title: 'Components/Stepper',
  component: Stepper,
};

const STEPS = [
  { label: 'Titular' },
  { label: 'Ubicación' },
  { label: 'Servicio' },
  { label: 'Instalación' },
  { label: 'Confirmar' },
];

const Controls = ({ step, setStep, total }) => (
  <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
    <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>Anterior</button>
    <button type="button" disabled={step === total} onClick={() => setStep(step + 1)}>Siguiente</button>
  </div>
);

export const Default = {
  render: (args) => {
    const [step, setStep] = useState(0);
    return (
      <div style={{ maxWidth: 900, background: 'linear-gradient(#fff, #eef4fe)', padding: 16 }}>
        <Stepper {...args} steps={STEPS} activeStep={step} />
        <Controls step={step} setStep={setStep} total={STEPS.length} />
      </div>
    );
  },
};

export const Clickable = {
  render: () => {
    const [step, setStep] = useState(2);
    return (
      <div style={{ maxWidth: 900 }}>
        <Stepper steps={STEPS} activeStep={step} onStepClick={(i) => setStep(i)} />
        <p style={{ textAlign: 'center' }}>Click en los pasos completados para volver.</p>
      </div>
    );
  },
};

export const ClickableAll = {
  render: () => {
    const [step, setStep] = useState(1);
    return (
      <div style={{ maxWidth: 900 }}>
        <Stepper steps={STEPS} activeStep={step} clickableSteps="all" onStepClick={(i) => setStep(i)} />
      </div>
    );
  },
};

export const WithError = {
  render: () => (
    <div style={{ maxWidth: 900 }}>
      <Stepper
        activeStep={2}
        steps={[{ label: 'Titular' }, { label: 'Ubicación', error: true }, ...STEPS.slice(2)]}
      />
    </div>
  ),
};

// SVG propio como data URI (string => se renderiza como <img>); también sirve cualquier URL de imagen.
const AVATAR_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f472b6"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="25" r="11" fill="#fff"/><path d="M10 58c3-14 14-19 22-19s19 5 22 19z" fill="#fff"/></svg>',
  );

const CustomSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12l9-9 9 9" />
    <path d="M5 10v10h14V10" />
  </svg>
);

export const WithIcons = {
  name: 'Con íconos (SVG, imagen, componente)',
  render: () => {
    const [step, setStep] = useState(2);
    return (
      <div style={{ maxWidth: 900 }}>
        <Stepper
          activeStep={step}
          onStepClick={(i) => setStep(i)}
          clickableSteps="all"
          size={52}
          steps={[
            { label: 'Imagen / URL', icon: AVATAR_URI },
            { label: 'SVG inline', icon: <CustomSvg /> },
            { label: 'Lucide', icon: <MapPin /> },
            { label: 'Componente', icon: Wrench },
            { label: 'Con error', icon: <Building2 />, error: true },
          ]}
        />
      </div>
    );
  },
};

// Seguimiento de un proceso: el paso en curso muestra un spinner (`activeLoading`) y
// `activeStep === steps.length` deja todo completado.
export const ProgresoVertical = {
  name: 'Vertical: progreso de un proceso',
  render: () => {
    const steps = [
      { label: 'Iniciando envío', description: 'Preparando la solicitud' },
      { label: 'Recolectando datos', description: 'Reuniendo la información' },
      { label: 'Validando', description: 'Verificando que todo esté correcto' },
      { label: 'Entregado', description: 'La solicitud llegó a destino' },
    ];
    const [step, setStep] = useState(1);
    return (
      <div style={{ maxWidth: 360 }}>
        <Stepper orientation="vertical" steps={steps} activeStep={step} activeLoading={step < steps.length} />
        <Controls step={step} setStep={setStep} total={steps.length} />
      </div>
    );
  },
};

export const Vertical = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Stepper
        orientation="vertical"
        activeStep={1}
        steps={[
          { label: 'Titular', description: 'Datos de la persona o empresa' },
          { label: 'Ubicación', description: 'Dirección de la instalación' },
          { label: 'Servicio', description: 'Tipo de conexión y potencia' },
          { label: 'Confirmar' },
        ]}
      />
    </div>
  ),
};

export const NarrowContainer = {
  name: 'Narrow (360px, compacto)',
  render: () => (
    <div style={{ width: 360, border: '1px dashed #cbd5e1' }}>
      <Stepper steps={STEPS} activeStep={1} />
    </div>
  ),
};

export const CustomColors = {
  name: 'Colores personalizados (tema oscuro)',
  render: () => (
    <div style={{ maxWidth: 900 }}>
      <Stepper
        activeStep={2}
        size={52}
        steps={[
          { label: 'Titular', icon: <Building2 /> },
          { label: 'Ubicación', icon: <MapPin /> },
          { label: 'Servicio', icon: <Wrench /> },
          { label: 'Instalación', error: true },
          { label: 'Confirmar' },
        ]}
        surfaceColor="#0f172a"
        surfaceBorderColor="#1e293b"
        bgColor="#1e293b"
        accentColor="linear-gradient(135deg, #34d399, #059669)"
        haloColor="#064e3b"
        borderColor="#334155"
        lineColor="#334155"
        lineActiveColor="#10b981"
        successColor="#059669"
        errorColor="#f43f5e"
        textColor="#94a3b8"
        activeTextColor="#f1f5f9"
        descriptionColor="#64748b"
        iconColor="#ffffff"
      />
    </div>
  ),
};
