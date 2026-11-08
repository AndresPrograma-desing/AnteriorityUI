import React, { useState, useMemo } from 'react';
import MediaViewer from '../index';
import Selector from '../../Material-UI/Components/Selector/index';
import Input from '../../Input/index';
import Button from '../../Button/index';
import FileDropZone from '../../FileDropZone/index';
import { sampleData, sampleSchema } from './jsonSample.js';
import { presets } from './jsonPresets.js';

export default {
  title: 'Components/MediaViewer/Planilla desde JSON',
  component: MediaViewer,
};

// Planilla armada desde JSON + JSON Schema: columnas y títulos del esquema, fechas reales y validaciones por columna.
export const ConEsquema = {
  render: () => (
    <div style={{ maxWidth: 900 }}>
      <MediaViewer
        xlsxData={sampleData}
        xlsxSchema={sampleSchema}
        xlsxSheetName="Tareas"
        xlsxEditable
        name="tareas.xlsx"
        onXlsxSave={({ fileName, data }) => console.log('Guardado', fileName, data)}
      />
    </div>
  ),
};

const pretty = (value) => (value === null || value === undefined ? '' : JSON.stringify(value, null, 2));

// Parsea el texto de un editor: '' = sin valor; un JSON inválido devuelve el error para mostrarlo.
const parseJson = (text) => {
  if (!text.trim()) return { value: null };
  try {
    return { value: JSON.parse(text) };
  } catch (error) {
    return { error: error.message };
  }
};

const MONO = { spellCheck: false, style: { fontFamily: 'monospace', fontSize: 12 } };

// Editor: se escribe o pega cualquier JSON (datos y esquema) y «Aplicar» arma la planilla para ver cómo se comporta.
// Hay presets para empezar, y el JSON de datos también se puede soltar o elegir como archivo .json.
const EditorTemplate = () => {
  const first = presets[0];
  const [presetId, setPresetId] = useState(first.id);
  const [schemaText, setSchemaText] = useState(pretty(first.schema));
  const [dataText, setDataText] = useState(pretty(first.data));
  const [applied, setApplied] = useState({ schema: first.schema, data: first.data });
  const [error, setError] = useState('');
  // `key` fuerza a armar la planilla de cero cada vez que se aplica un JSON nuevo.
  const [version, setVersion] = useState(0);

  const loadPreset = (id) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setPresetId(id);
    setSchemaText(pretty(preset.schema));
    setDataText(pretty(preset.data));
    setError('');
    setApplied({ schema: preset.schema, data: preset.data });
    setVersion((v) => v + 1);
  };

  const apply = () => {
    const schema = parseJson(schemaText);
    const data = parseJson(dataText);
    if (schema.error) {
      setError(`Esquema: ${schema.error}`);
      return;
    }
    if (data.error) {
      setError(`Datos: ${data.error}`);
      return;
    }
    if (!Array.isArray(data.value)) {
      setError('Datos: tiene que ser un array de objetos, ej. [{ "a": 1 }]');
      return;
    }
    setError('');
    setApplied({ schema: schema.value, data: data.value });
    setVersion((v) => v + 1);
  };

  const loadFile = async (file) => {
    setDataText(await file.text());
    setPresetId('');
  };

  const data = useMemo(() => applied.data, [applied]);
  const schema = useMemo(() => applied.schema || undefined, [applied]);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 1100 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <Selector
            label="Ejemplo"
            options={presets.map((p) => ({ value: p.id, label: p.label }))}
            value={presetId}
            onChange={(e) => loadPreset(e.target.value)}
            disableClearable
          />
          <Input
            label="JSON Schema (opcional)"
            multiline
            rows={14}
            value={schemaText}
            onChange={(e) => setSchemaText(e.target.value)}
            inputProps={MONO}
          />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <FileDropZone accept=".json,application/json" label="Soltá un .json de datos, pegalo o hacé click" onFile={loadFile} />
          <Input
            label="Datos (array de objetos)"
            multiline
            rows={14}
            value={dataText}
            onChange={(e) => setDataText(e.target.value)}
            error={error || undefined}
            inputProps={MONO}
          />
        </div>
      </div>
      <div>
        <Button onClick={apply}>Aplicar JSON</Button>
      </div>
      <MediaViewer
        key={version}
        xlsxData={data}
        xlsxSchema={schema}
        xlsxSheetName="Datos"
        xlsxEditable
        name="datos.xlsx"
        onXlsxSave={({ fileName, data: rows }) => console.log('Guardado', fileName, rows)}
      />
    </div>
  );
};

export const Editor = {
  render: () => <EditorTemplate />,
};
