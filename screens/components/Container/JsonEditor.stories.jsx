import React from 'react';
import Container from './index';
import JsonEditorDemo from './stories/JsonEditorDemo';
import { PRESETS } from './stories/presets.js';

export default {
  title: 'Components/Container (JSON)',
  component: Container,
  parameters: { layout: 'fullscreen' },
};

// El formato del JSON que espera el Container está documentado en ./stories/presets.js.
export const WizardEditable = {
  name: 'Wizard (editá el JSON)',
  render: () => <JsonEditorDemo initialPreset={Object.keys(PRESETS)[0]} />,
};

export const FormularioEditable = {
  name: 'Solo formulario (editá el JSON)',
  render: () => <JsonEditorDemo initialPreset={Object.keys(PRESETS)[1]} />,
};
