import React, { useEffect, useMemo, useRef, useState } from 'react';
import DrawPanel from '../index';
import Button from '../../Button/index';
import { DEFAULT_JSON_PROGRESS } from './presets.js';

const toText = (value) => JSON.stringify(value, null, 2);

const editorStyle = {
  width: '100%',
  minHeight: 460,
  boxSizing: 'border-box',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: 12.5,
  lineHeight: 1.5,
  padding: 12,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#0f172a',
  color: '#e2e8f0',
  resize: 'vertical',
};

// DrawPanel guiado por JSON: el formulario sale de `schema` y, al enviarlo, el panel muestra el
// seguimiento del envío con un Stepper vertical que avanza etapa por etapa (simulado con timers).
// Las etapas de `failAt` fallan la primera vez: el footer ofrece "Reintentar" y retoma en esa etapa.
// Compartido por la story del DrawPanel y por el Playground.
export default function JsonProgressDemo() {
  const [text, setText] = useState(toText(DEFAULT_JSON_PROGRESS));
  const [lastValid, setLastValid] = useState(DEFAULT_JSON_PROGRESS);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('form'); // 'form' | 'sending' | 'error' | 'done'
  const [step, setStep] = useState(0);
  const passed = useRef(new Set());
  const timer = useRef(null);

  const parsed = useMemo(() => {
    try {
      return { config: JSON.parse(text), error: null };
    } catch (err) {
      return { config: null, error: err.message };
    }
  }, [text]);
  if (parsed.config && parsed.config !== lastValid) setLastValid(parsed.config);
  const config = parsed.config ?? lastValid;

  const steps = Array.isArray(config.steps) ? config.steps : [];
  const failAt = Array.isArray(config.failAt) ? config.failAt : [];
  const stepMs = Number(config.stepMs) > 0 ? Number(config.stepMs) : 1200;

  useEffect(() => () => clearTimeout(timer.current), []);

  const run = (from) => {
    clearTimeout(timer.current);
    setPhase('sending');
    setStep(from);
    const advance = (index) => {
      timer.current = setTimeout(() => {
        if (failAt.includes(index) && !passed.current.has(index)) {
          passed.current.add(index);
          setStep(index);
          setPhase('error');
          return;
        }
        setStep(index + 1);
        if (index >= steps.length - 1) setPhase('done');
        else advance(index + 1);
      }, stepMs);
    };
    advance(from);
  };

  const reset = () => {
    clearTimeout(timer.current);
    passed.current = new Set();
    setPhase('form');
    setStep(0);
  };

  const failed = phase === 'error';
  const shownSteps = steps.map((item, index) => ({ ...item, error: failed && index === step }));

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
        <Button onClick={() => { reset(); setOpen(true); }}>Abrir panel</Button>
        <span style={{ fontSize: 13, opacity: 0.7 }}>Editá el JSON y volvé a abrir el panel.</span>
      </div>
      <textarea
        style={editorStyle}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        aria-label="JSON del DrawPanel"
      />
      <p style={{ margin: '6px 0 0', fontSize: 13, color: parsed.error ? '#dc2626' : '#16a34a' }}>
        {parsed.error ? `JSON inválido (se usa el último válido): ${parsed.error}` : 'JSON válido'}
      </p>

      <DrawPanel
        isOpen={open}
        onClose={() => setOpen(false)}
        title={config.title ?? 'Solicitud'}
        description={phase === 'form' ? 'Completá los datos y enviá' : `Etapa ${Math.min(step + 1, steps.length)} de ${steps.length}`}
        schema={phase === 'form' ? config.schema : undefined}
        uiSchema={config.uiSchema}
        onSubmit={() => run(0)}
        showStepper={phase !== 'form' && steps.length > 0}
        steps={shownSteps}
        activeStep={step}
        stepperProps={{ activeLoading: phase === 'sending' }}
        confirmText={failed ? 'Reintentar' : 'Enviar'}
        onConfirm={failed ? () => run(step) : undefined}
        cancelText={phase === 'form' ? 'Cancelar' : 'Cerrar'}
        showActions={phase !== 'sending'}
        showConfirmButton={phase === 'form' || failed}
      >
        {failed && (
          <p style={{ margin: '12px 0 0', color: '#dc2626' }}>
            Falló la etapa {step + 1} ({steps[step]?.label}). Podés reintentar.
          </p>
        )}
        {phase === 'done' && <p style={{ margin: '12px 0 0' }}>¡Solicitud entregada!</p>}
      </DrawPanel>
    </div>
  );
}
