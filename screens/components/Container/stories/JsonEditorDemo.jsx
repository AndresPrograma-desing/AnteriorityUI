import React, { useMemo, useState } from 'react';
import Container from '../index';
import { PRESETS } from './presets.js';

export const DEFAULT_PRESET = Object.keys(PRESETS)[0];

// Editor de JSON en vivo para el Container: lo que escribas a la izquierda se renderiza a la derecha.
// Compartido por las stories (Container (JSON)) y por el Playground.
const toText = (value) => JSON.stringify(value, null, 2);

const pageStyle = { display: 'flex', flexWrap: 'wrap', gap: 16, padding: 16, alignItems: 'flex-start' };
const editorStyle = {
  width: '100%',
  minHeight: 520,
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

// Editor de JSON en vivo: lo que escribas a la izquierda se renderiza a la derecha en un Container.
export default function JsonEditorDemo({ initialPreset = DEFAULT_PRESET }) {
  const [text, setText] = useState(toText(PRESETS[initialPreset]));
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [submitted, setSubmitted] = useState(null);

  // Si el JSON es inválido se conserva el último válido y se muestra el error.
  const parsed = useMemo(() => {
    try {
      return { config: JSON.parse(text), error: null };
    } catch (err) {
      return { config: null, error: err.message };
    }
  }, [text]);
  const [lastValid, setLastValid] = useState(PRESETS[initialPreset]);
  if (parsed.config && parsed.config !== lastValid) setLastValid(parsed.config);
  const config = parsed.config ?? lastValid;

  const steps = Array.isArray(config.steps) ? config.steps : [];
  const hasStepper = steps.length > 0;
  const activeStep = Math.min(step, Math.max(steps.length - 1, 0));
  const isLast = activeStep === steps.length - 1;

  const loadPreset = (name) => {
    setText(toText(PRESETS[name]));
    setStep(0);
    setData({});
    setSubmitted(null);
  };

  return (
    <div style={pageStyle}>
      <div style={{ flex: '1 1 340px', minWidth: 0, maxWidth: 620 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <select onChange={(e) => loadPreset(e.target.value)} defaultValue={initialPreset} aria-label="Preset">
            {Object.keys(PRESETS).map((name) => <option key={name}>{name}</option>)}
          </select>
          <label style={{ fontSize: 13 }}>
            <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} /> loading
          </label>
        </div>
        <textarea
          style={editorStyle}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          aria-label="JSON del Container"
        />
        <p style={{ margin: '6px 0 0', fontSize: 13, color: parsed.error ? '#dc2626' : '#16a34a' }}>
          {parsed.error ? `JSON inválido (se muestra el último válido): ${parsed.error}` : 'JSON válido'}
        </p>
      </div>

      <div style={{ flex: '2 1 420px', minWidth: 0 }}>
        <Container
          header={<strong>{hasStepper ? 'Wizard' : 'Formulario'}</strong>}
          loading={loading}
          showStepper={hasStepper}
          steps={steps}
          activeStep={activeStep}
          onStepClick={setStep}
          schema={config.schema}
          uiSchema={config.uiSchema}
          formData={data}
          onFormChange={(values) => setData((prev) => ({ ...prev, ...values }))}
          onFormSubmit={(values) => {
            const all = { ...data, ...values };
            setData(all);
            if (hasStepper && !isLast) setStep(activeStep + 1);
            else setSubmitted(all);
          }}
          schemaFormProps={{ submitText: hasStepper && !isLast ? 'Siguiente' : 'Enviar' }}
          style={{ minHeight: 380 }}
        />
        <details open style={{ marginTop: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>formData actual</summary>
          <pre style={{ background: '#f1f5f9', padding: 12, borderRadius: 8, overflow: 'auto' }}>{toText(data)}</pre>
        </details>
        {submitted && (
          <details open>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Enviado (onFormSubmit final)</summary>
            <pre style={{ background: '#ecfdf5', padding: 12, borderRadius: 8, overflow: 'auto' }}>{toText(submitted)}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
