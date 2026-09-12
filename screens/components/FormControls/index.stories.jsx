import { Settings, FileText } from 'lucide-react';
import { FormCard, FormInput, FormTextArea } from './index.jsx';

export default {
  title: 'Components/FormControls',
  component: FormCard,
};

export const Card = {
  render: () => (
    <FormCard icon={Settings} title="Preferencias">
      <p style={{ margin: 0 }}>Contenido de la tarjeta de formulario.</p>
    </FormCard>
  ),
};

export const CardWithHeaderActions = {
  render: () => (
    <FormCard
      icon={FileText}
      title="Datos del contacto"
      headerActions={<button type="button">Editar</button>}
    >
      <FormInput label="Nombre completo" placeholder="Juan Pérez" />
    </FormCard>
  ),
};

export const InputAndTextArea = {
  render: () => (
    <FormCard icon={FileText} title="Comentarios">
      <FormInput label="Asunto" placeholder="Escribe un asunto" />
      <FormTextArea label="Descripción" placeholder="Cuéntanos más detalles" rows={5} />
    </FormCard>
  ),
};
