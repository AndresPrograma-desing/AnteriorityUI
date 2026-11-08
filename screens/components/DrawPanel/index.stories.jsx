import { useState } from 'react';
import DrawPanel from './index.jsx';
import Callout from '../Callout/index.jsx';
import Button from '../Button/index.jsx';
import { MedalIcon, Star, ShieldCheck, Gift } from 'lucide-react';

export default {
  title: 'Components/DrawPanel',
  component: DrawPanel,
};

export const Default = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    title: 'Detalle del registro',
    description: 'Revisa la información antes de continuar',
    width: '420px',
    closeIcon: MedalIcon,
    children: (
      <p style={{ margin: 0 }}>Contenido del panel lateral.</p>
    ),
  },
};

export const WithActions = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    onConfirm: () => console.log('confirmed'),
    title: 'Confirmar acción',
    description: 'Esta acción no se puede deshacer',
    descriptionPosition: 'bottom',
    showActions: true,
    confirmText: 'Guardar',
    cancelText: 'Cancelar',
    width: '400px',
    children: (
      <p style={{ margin: 0 }}>Formulario o resumen de la acción a confirmar.</p>
    ),
  },
};

export const WithCountdownSelectionProgress = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    title: 'Selecciona elementos',
    width: '420px',
    showCountdown: true,
    progressMode: 'selection',
    totalItems: ['a', 'b', 'c', 'd'],
    selectedItems: ['a', 'b'],
    children: (
      <div>
      {Array.from({ length: 20 }).map((_, index) => (
        <Callout
          key={index}
          title={`Elemento ${index + 1}`}
          description={`Descripción del elemento ${index + 1}`}
        />
      ))}
      </div>
    ),
  },
};

export const ContentLoading = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    title: 'Detalle del registro',
    width: '420px',
    contentLoading: true,
    contentLoadingText: 'Cargando información...',
    loading: false,
    children: (
      <p style={{ margin: 0 }}>Este contenido no se muestra mientras contentLoading es true.</p>
    ),
  },
};

export const ContentLoadingSkeleton = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    title: 'Detalle del registro',
    width: '420px',
    contentLoading: true,
    typeLoading: 'skeleton',
    loading: false,
    children: (
      <p style={{ margin: 0 }}>Este contenido no se muestra mientras contentLoading es true.</p>
    ),
  },
};

export const TopAnchor = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    title: 'Aviso',
    anchor: 'top',
    width: '480px',
    children: (
      <p style={{ margin: 0 }}>Panel anclado en la parte superior de la pantalla.</p>
    ),
  },
};

// ---------------------------------------------------------------------------------------------
// Modo JSON Schema: con la prop `schema` el panel pinta un formulario dinámico (SchemaForm) según
// lo que llegue en el JSON. El botón confirmar del footer envía el formulario (validado) y llama
// a `onSubmit(formData)`. Requiere @rjsf/core (peer dependency opcional de la librería).
// ---------------------------------------------------------------------------------------------
const solicitudSchema = {
  type: 'object',
  required: ['nombre', 'email'],
  properties: {
    nombre: { type: 'string', title: 'Nombre', minLength: 2 },
    email: { type: 'string', title: 'Email', format: 'email' },
    edad: { type: 'integer', title: 'Edad', minimum: 18, maximum: 99 },
    pais: {
      type: 'string',
      title: 'País',
      enum: ['ar', 'uy', 'br'],
      enumNames: ['Argentina', 'Uruguay', 'Brasil'],
    },
    nacimiento: { type: 'string', title: 'Fecha de nacimiento', format: 'date' },
    notificaciones: { type: 'boolean', title: 'Recibir notificaciones', default: false },
    comentarios: { type: 'string', title: 'Comentarios' },
    nota: { type: 'string', format: 'data-url', title: 'Nota de voz' },
  },
};

const solicitudUiSchema = {
  notificaciones: { 'ui:options': { labelPosition: 'right' } },
  comentarios: { 'ui:widget': 'TextareaWidget' },
  nacimiento: { 'ui:widget': 'DateWidget' },
  nota: { 'ui:widget': 'AudioWidget' },
};

// Datos internos: el panel guarda los datos y los reinicia al cerrarse. Con barra de progreso,
// que por default sigue a los campos `required` del schema (nombre y email).
export const ConJsonSchema = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Abrir panel</Button>
        <DrawPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Nueva solicitud"
          description="Completá los datos. El formulario se arma a partir de un JSON Schema."
          width="440px"
          schema={solicitudSchema}
          uiSchema={solicitudUiSchema}
          showCountdown
          countdownActive={false}
          confirmText="Enviar solicitud"
          onSubmit={(data) => {
            console.log('Enviado:', data);
            alert('Enviado (ver consola para el JSON)');
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
};

// Datos controlados: el formulario vive en el estado del padre (prop `formData` +
// `onFormDataChange`), por ejemplo para precargar un registro existente.
export const ConJsonSchemaControlado = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [formData, setFormData] = useState({
      nombre: 'Jane Doe',
      email: 'jane.doe@example.com',
      pais: 'ar',
    });
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Editar solicitud</Button>
        <pre style={{ fontSize: 12, marginTop: 16 }}>{JSON.stringify(formData, null, 2)}</pre>
        <DrawPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Editar solicitud"
          width="440px"
          schema={solicitudSchema}
          uiSchema={solicitudUiSchema}
          formData={formData}
          onFormDataChange={setFormData}
          confirmText="Guardar"
          onSubmit={(data) => {
            console.log('Guardado:', data);
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
};

// Sin footer (`showActions: false`): el propio formulario muestra su botón de envío.
export const ConJsonSchemaSinFooter = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Abrir panel</Button>
        <DrawPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Contacto"
          width="420px"
          showActions={false}
          schema={{
            type: 'object',
            required: ['email'],
            properties: {
              email: { type: 'string', title: 'Email', format: 'email' },
              mensaje: { type: 'string', title: 'Mensaje' },
            },
          }}
          uiSchema={{ mensaje: { 'ui:widget': 'TextareaWidget' } }}
          onSubmit={(data) => console.log('Enviado:', data)}
        />
      </div>
    );
  },
};

// Con anchor="top" y estado de carga del botón confirmar (`loading` también deshabilita los campos).
export const ConJsonSchemaGuardando = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Abrir panel</Button>
        <DrawPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Guardar con carga"
          anchor="top"
          loading={loading}
          schema={solicitudSchema}
          uiSchema={solicitudUiSchema}
          onSubmit={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setIsOpen(false);
            }, 1500);
          }}
        />
      </div>
    );
  },
};

// Textos y badges entre campos: NoteWidget/BadgeWidget son campos decorativos del schema (sin valor
// ni validación). `text`, `title` y `when` aceptan funciones de formData; `variant`, `icon` y los
// colores se pasan por `ui:options`. Probá cambiar Edad, Plan y Puntos.
const avisosSchema = {
  type: 'object',
  required: ['nombre'],
  properties: {
    badgePlan: { type: 'string' },
    nombre: { type: 'string', title: 'Nombre', minLength: 2 },
    edad: { type: 'integer', title: 'Edad', minimum: 0, maximum: 120 },
    avisoMenor: { type: 'string' },
    plan: { type: 'string', title: 'Plan', enum: ['free', 'pro'], enumNames: ['Gratis', 'Pro'] },
    avisoPro: { type: 'string' },
    puntos: { type: 'integer', title: 'Puntos', minimum: 0 },
    badgeNivel: { type: 'string' },
    avisoExito: { type: 'string' },
    notaFinal: { type: 'string' },
  },
};

const avisosUiSchema = {
  badgePlan: {
    'ui:widget': 'BadgeWidget',
    'ui:options': {
      icon: Star,
      iconColor: '#7c3aed',
      badgeLabel: 'Plan',
      text: (d) => (d.plan === 'pro' ? 'Pro' : 'Gratis'),
      bgColor: '#f5f3ff',
      borderColor: '#c4b5fd',
      labelColor: '#6d28d9',
      valueColor: '#4c1d95',
    },
  },
  avisoMenor: {
    'ui:widget': 'NoteWidget',
    'ui:options': {
      variant: 'warning',
      when: (d) => typeof d.edad === 'number' && d.edad < 18,
      title: 'Menor de edad',
      text: (d) => `Con ${d.edad} años se requiere autorización de un tutor.`,
    },
  },
  avisoPro: {
    'ui:widget': 'NoteWidget',
    'ui:options': {
      when: (d) => d.plan === 'pro',
      icon: ShieldCheck,
      title: 'Soporte prioritario activo',
      text: 'Respondemos en menos de 2 horas hábiles.',
      bgColor: '#ecfeff',
      borderColor: '#22d3ee',
      textColor: '#164e63',
      iconColor: '#0891b2',
    },
  },
  badgeNivel: {
    'ui:widget': 'BadgeWidget',
    'ui:options': {
      icon: Gift,
      badgeLabel: 'Nivel',
      when: (d) => typeof d.puntos === 'number',
      text: (d) => (d.puntos >= 1000 ? 'Oro' : d.puntos >= 500 ? 'Plata' : 'Bronce'),
      bgColor: '#fffbeb',
      borderColor: '#fcd34d',
      valueColor: '#92400e',
    },
  },
  avisoExito: {
    'ui:widget': 'NoteWidget',
    'ui:options': {
      variant: 'success',
      when: (d) => d.puntos >= 1000,
      title: '¡Nivel Oro!',
      text: (d) => `Con ${d.puntos} puntos accedés a todos los beneficios.`,
    },
  },
  notaFinal: {
    'ui:widget': 'NoteWidget',
    'ui:options': { variant: 'info', text: 'Revisá los datos antes de guardar.' },
  },
};

export const ConTextosYBadges = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [formData, setFormData] = useState({ nombre: 'Jane', edad: 16, plan: 'pro', puntos: 1200 });
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Abrir panel</Button>
        <DrawPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Perfil con avisos"
          width="440px"
          schema={avisosSchema}
          uiSchema={avisosUiSchema}
          formData={formData}
          onFormDataChange={setFormData}
          confirmText="Guardar"
          onSubmit={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

// `markdown` renderiza el texto con MarkdownContent (negritas, listas, links, {color:..}..{/color},
// tablas, bloques copiables, Mermaid). Reemplaza a `description` y respeta `descriptionPosition`.
export const ConMarkdown = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Abrir panel</Button>
        <DrawPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Revisar solicitud"
          width="440px"
          markdown={`**Antes de continuar** revisá:

- Que el email sea {color:#dc2626}corporativo{/color}
- Que la edad sea mayor a 18

Más info en [la guía](https://example.com).`}
          schema={avisosSchema}
          uiSchema={avisosUiSchema}
          confirmText="Guardar"
          onSubmit={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const ConMarkdownAbajo = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Abrir panel</Button>
        <DrawPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Revisar solicitud"
          width="440px"
          descriptionPosition="bottom"
          markdown={`### Condiciones

1. Los datos son **definitivos**.
2. Se notificará por email.

| Plan | Soporte |
|---|---|
| Gratis | 48 hs |
| Pro | 2 hs |`}
          schema={avisosSchema}
          uiSchema={avisosUiSchema}
          confirmText="Guardar"
          onSubmit={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

// Markdown como contenido del cuerpo (no pegado al título del encabezado).
export const MarkdownEnElCuerpo = {
  args: {
    isOpen: true,
    onClose: () => console.log('closed'),
    title: 'Detalle de la tarea',
    descriptionPosition: 'body',
    showActions: false,
    markdown: [
      '**Estado:** En curso',
      '',
      '| Campo | Valor |',
      '|---|---|',
      '| Prioridad | **Alta** |',
      '| Responsable | Ana Gómez |',
    ].join(String.fromCharCode(10)),
  },
};
