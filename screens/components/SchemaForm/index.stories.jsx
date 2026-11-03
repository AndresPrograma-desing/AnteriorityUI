import { useState } from 'react';
import { Star, ShieldCheck, Clock, Gift } from 'lucide-react';
import validator from '@rjsf/validator-ajv8';
import SchemaForm from './index';
import DrawPanel from '../DrawPanel/index';
import Button from '../Button/index';

export default {
  title: 'Components/SchemaForm',
  component: SchemaForm,
};

const loginSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', title: 'Email', format: 'email' },
    password: { type: 'string', title: 'Contraseña' },
    rememberMe: { type: 'boolean', title: 'Recordarme' },
  },
};

const loginUiSchema = {
  password: { 'ui:widget': 'password' },
  rememberMe: { 'ui:widget': 'SwitchWidget' },
};

export const Login = {
  render: () => {
    const [formData, setFormData] = useState({});
    return (
      <div style={{ maxWidth: 360 }}>
        <SchemaForm
          schema={loginSchema}
          uiSchema={loginUiSchema}
          formData={formData}
          validator={validator}
          onChange={setFormData}
          onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
          submitText="Ingresar"
        />
      </div>
    );
  },
};

const profileSchema = {
  type: 'object',
  required: ['nombre'],
  properties: {
    nombre: { type: 'string', title: 'Nombre' },
    edad: { type: 'integer', title: 'Edad', minimum: 0, maximum: 120 },
    bio: { type: 'string', title: 'Biografía' },
    pais: {
      type: 'string',
      title: 'País',
      enum: ['ar', 'uy', 'br'],
    },
    nacimiento: { type: 'string', title: 'Fecha de nacimiento', format: 'date' },
    activo: { type: 'boolean', title: 'Cuenta activa' },
  },
};

const profileUiSchema = {
  bio: { 'ui:widget': 'TextareaWidget' },
  pais: {
    'ui:widget': 'SelectWidget',
    'ui:options': {
      enumOptions: [
        { value: 'ar', label: 'Argentina' },
        { value: 'uy', label: 'Uruguay' },
        { value: 'br', label: 'Brasil' },
      ],
    },
  },
  nacimiento: { 'ui:widget': 'DateWidget' },
};

export const PerfilCompleto = {
  render: () => {
    const [formData, setFormData] = useState({});
    return (
      <div style={{ maxWidth: 420 }}>
        <SchemaForm
          schema={profileSchema}
          uiSchema={profileUiSchema}
          formData={formData}
          validator={validator}
          onChange={setFormData}
          onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
        />
      </div>
    );
  },
};

const usuarioSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Usuario',
  description: 'Esquema para validar datos de un usuario en el sistema',
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      minimum: 1,
      description: 'Identificador único del usuario',
    },
    nombre: {
      type: 'string',
      minLength: 2,
      maxLength: 50,
      description: 'Nombre completo del usuario',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Correo electrónico válido',
    },
    edad: {
      type: 'integer',
      minimum: 18,
      maximum: 99,
      description: 'Edad del usuario (entre 18 y 99 años)',
    },
    activo: {
      type: 'boolean',
      default: true,
      description: 'Indica si el usuario está activo',
    },
    roles: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['admin', 'editor', 'viewer'],
      },
      minItems: 1,
      uniqueItems: true,
      description: 'Lista de roles asignados al usuario',
    },
    direccion: {
      type: 'object',
      properties: {
        calle: { type: 'string' },
        ciudad: { type: 'string' },
        codigoPostal: {
          type: 'string',
          pattern: '^[0-9]{4,6}$',
          description: 'Código postal numérico de 4 a 6 dígitos',
        },
      },
      required: ['calle', 'ciudad'],
      additionalProperties: false,
    },
  },
  required: ['id', 'nombre', 'email', 'edad', 'roles'],
  additionalProperties: false,
};

const usuarioUiSchema = {
  roles: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      enumOptions: [
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Viewer' },
      ],
    },
  },
  direccion: {
    codigoPostal: { 'ui:placeholder': '1900' },
  },
};

export const UsuarioAnidado = {
  render: () => {
    const [formData, setFormData] = useState({});
    return (
      <div style={{ maxWidth: 420 }}>
        <SchemaForm
          schema={usuarioSchema}
          uiSchema={usuarioUiSchema}
          formData={formData}
          validator={validator}
          onChange={setFormData}
          onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
        />
      </div>
    );
  },
};

const documentoSchema = {
  type: 'object',
  required: ['nombre'],
  properties: {
    nombre: { type: 'string', title: 'Nombre del documento' },
    avatar: {
      type: 'string',
      format: 'data-url',
      title: 'Foto de perfil',
      description: 'JPG o PNG, una sola imagen',
    },
    adjuntos: {
      type: 'array',
      title: 'Archivos adjuntos',
      items: { type: 'string', format: 'data-url' },
      description: 'Podés subir varios archivos',
    },
  },
};

const documentoUiSchema = {
  avatar: {
    'ui:options': { accept: 'image/*' },
  },
  adjuntos: {
    'ui:options': { multiple: true },
  },
};

export const ConArchivos = {
  render: () => {
    const [formData, setFormData] = useState({});
    return (
      <div style={{ maxWidth: 420 }}>
        <SchemaForm
          schema={documentoSchema}
          uiSchema={documentoUiSchema}
          formData={formData}
          validator={validator}
          onChange={setFormData}
          onSubmit={(data) => alert('Enviado (ver consola para el detalle de los data-URLs)') || console.log(data)}
        />
      </div>
    );
  },
};

// Campos de audio: 'ui:widget': 'AudioWidget' sobre un string data-url (una nota de voz) o un
// array de data-urls con multiple (varias). Al guardar la grabación el valor queda como
// `data:audio/webm;base64,...`. Las opciones del grabador (límite, bitrate, labels, colores) van
// en 'ui:options'. Requiere permiso de micrófono (localhost o HTTPS).
const audioSchema = {
  type: 'object',
  properties: {
    nota: {
      type: 'string',
      format: 'data-url',
      title: 'Nota de voz',
      description: 'Una sola grabación, de hasta 60 segundos',
    },
    notas: {
      type: 'array',
      title: 'Notas de voz (varias)',
      items: { type: 'string', format: 'data-url' },
    },
  },
};

const audioUiSchema = {
  nota: {
    'ui:widget': 'AudioWidget',
    'ui:options': { maxDurationSeconds: 60 },
  },
  notas: {
    'ui:widget': 'AudioWidget',
    'ui:options': { multiple: true },
  },
};

export const ConAudio = {
  render: () => {
    const [formData, setFormData] = useState({});
    return (
      <div style={{ maxWidth: 420 }}>
        <SchemaForm
          schema={audioSchema}
          uiSchema={audioUiSchema}
          formData={formData}
          validator={validator}
          onChange={setFormData}
          onSubmit={(data) => alert('Enviado (ver consola para el detalle de los data-URLs)') || console.log(data)}
        />
      </div>
    );
  },
};

// Un único schema que ejercita todos los tipos/formatos que SchemaForm sabe
// interpretar, como referencia de "qué forma de JSON Schema produce cada widget".
// Mismo schema documentado en AnteriorityUI.md bajo "Schema de referencia completo".
const referenciaSchema = {
  type: 'object',
  required: ['nombre', 'email'],
  properties: {
    nombre: {
      type: 'string',
      title: 'Nombre',
      minLength: 2,
      maxLength: 50,
      description: 'Texto corto → TextWidget (Input)',
    },
    bio: {
      type: 'string',
      title: 'Biografía',
      description: 'Texto largo → TextareaWidget si se pide en uiSchema (FormTextArea)',
    },
    edad: {
      type: 'integer',
      title: 'Edad',
      minimum: 18,
      maximum: 99,
      description: 'number/integer → NumberWidget (Input numeric)',
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email',
      description: "format: 'email' → EmailWidget (Input type=email)",
    },
    password: {
      type: 'string',
      title: 'Contraseña',
      description: "ui:widget: 'password' → PasswordWidget (Input type=password)",
    },
    sitioWeb: {
      type: 'string',
      format: 'uri',
      title: 'Sitio web',
      description: "format: 'uri' → URLWidget (Input type=url)",
    },
    activo: {
      type: 'boolean',
      title: 'Cuenta activa',
      default: true,
      description: 'boolean (default) → CheckboxWidget, que en SchemaForm es un Swich',
    },
    recibirNotificaciones: {
      type: 'boolean',
      title: 'Recibir notificaciones',
      description: "boolean + ui:widget: 'ChecksWidget' → look de checkbox clásico (Checks)",
    },
    pais: {
      type: 'string',
      title: 'País',
      enum: ['ar', 'uy', 'br'],
      description: 'string + enum → SelectWidget (Selector, single-select)',
    },
    plan: {
      type: 'string',
      title: 'Plan',
      enum: ['free', 'pro', 'enterprise'],
      description: "string + enum + ui:widget: 'radio' → RadioWidget (RadioGroup + Radio)",
    },
    roles: {
      type: 'array',
      title: 'Roles',
      items: { type: 'string', enum: ['admin', 'editor', 'viewer'] },
      minItems: 1,
      uniqueItems: true,
      description: "array de enum + ui:widget: 'CheckboxesWidget' → selección múltiple (Checks)",
    },
    nacimiento: {
      type: 'string',
      format: 'date',
      title: 'Fecha de nacimiento',
      description: "format: 'date' + ui:widget: 'DateWidget' → CalendarPicker",
    },
    avatar: {
      type: 'string',
      format: 'data-url',
      title: 'Foto de perfil',
      description: "format: 'data-url' → FileWidget, un solo archivo (data-URL en base64)",
    },
    adjuntos: {
      type: 'array',
      title: 'Archivos adjuntos',
      items: { type: 'string', format: 'data-url' },
      description: "array de format: 'data-url' → FileWidget con multiple=true (detectado solo por rjsf)",
    },
    colorFavorito: {
      type: 'string',
      format: 'color',
      title: 'Color favorito',
      default: '#2563eb',
      description: "format: 'color' → ColorWidget (ColorPicker)",
    },
    satisfaccion: {
      type: 'integer',
      title: 'Satisfacción',
      minimum: 0,
      maximum: 10,
      default: 5,
      description: "number/integer + ui:widget: 'range' → RangeWidget (Slider), min/max desde minimum/maximum",
    },
    direccion: {
      type: 'object',
      title: 'Dirección',
      properties: {
        calle: { type: 'string', title: 'Calle' },
        ciudad: { type: 'string', title: 'Ciudad' },
        codigoPostal: {
          type: 'string',
          title: 'Código postal',
          pattern: '^[0-9]{4,6}$',
        },
      },
      required: ['calle', 'ciudad'],
      description: 'object anidado → ObjectFieldTemplate, recursivo (cada property usa su propio widget)',
    },
  },
};

const referenciaUiSchema = {
  bio: { 'ui:widget': 'TextareaWidget' },
  password: { 'ui:widget': 'password' },
  recibirNotificaciones: { 'ui:widget': 'ChecksWidget' },
  roles: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      enumOptions: [
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Viewer' },
      ],
    },
  },
  plan: { 'ui:widget': 'radio' },
  nacimiento: { 'ui:widget': 'DateWidget' },
  avatar: { 'ui:options': { accept: 'image/*' } },
  adjuntos: { 'ui:options': { multiple: true } },
  satisfaccion: { 'ui:widget': 'range' },
};

export const SchemaReferencia = {
  render: () => {
    const [formData, setFormData] = useState({});
    return (
      <div style={{ maxWidth: 420 }}>
        <SchemaForm
          schema={referenciaSchema}
          uiSchema={referenciaUiSchema}
          formData={formData}
          validator={validator}
          onChange={setFormData}
          onSubmit={(data) => console.log(data) || alert('Ver consola para el JSON enviado')}
        />
      </div>
    );
  },
};

export const DentroDeDrawPanel = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [formData, setFormData] = useState({});
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Abrir panel</Button>
        <DrawPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Editar perfil"
          formData={formData}
          showActions
          formId="profile-form"
          onConfirm={() => {}}
        >
          <SchemaForm
            formId="profile-form"
            schema={profileSchema}
            uiSchema={profileUiSchema}
            formData={formData}
            validator={validator}
            onChange={setFormData}
            onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
            showSubmitButton={false}
          />
        </DrawPanel>
      </div>
    );
  },
};

const colorSchema = {
  type: 'object',
  properties: {
    colorFavorito: {
      type: 'string',
      format: 'color',
      title: 'Color favorito',
      default: '#7c3aed',
    },
  },
};

// Las props de color del popover de ColorPicker (bgColor/textColor/borderColor/accentColor)
// se pasan vía ui:options, no por el schema — igual que options.inputType en TextWidget o
// options.accept en FileWidget. Sin esto, el popover del selector queda con su fondo claro
// default aunque el formulario entero esté oscurecido (ver colorSchemaUiSchema abajo).
const colorSchemaUiSchema = {
  colorFavorito: {
    'ui:options': {
      bgColor: '#1e1b2e',
      textColor: '#e9e4f7',
      borderColor: '#3d3659',
      accentColor: '#a78bfa',
    },
  },
};

export const ColorWidgetPersonalizado = {
  render: () => {
    const [formData, setFormData] = useState({ colorFavorito: '#7c3aed' });
    return (
      <div style={{ background: '#13111c', padding: '2rem', borderRadius: '12px' }}>
        <SchemaForm
          schema={colorSchema}
          uiSchema={colorSchemaUiSchema}
          formData={formData}
          validator={validator}
          onChange={setFormData}
          showSubmitButton={false}
        />
      </div>
    );
  },
};

// Textos y badges entre campos: son campos decorativos (sin valor ni validación) que se
// declaran en el schema como cualquier otro y se renderizan con BadgeWidget / NoteWidget.
// `text`, `title` y `when` aceptan funciones de formData para mostrarse según lo ingresado.
const avisosSchema = {
  type: 'object',
  required: ['nombre'],
  properties: {
    estado: { type: 'string', title: 'Solicitud en revisión' },
    nombre: { type: 'string', title: 'Nombre' },
    edad: { type: 'integer', title: 'Edad', minimum: 0, maximum: 120 },
    avisoMenor: { type: 'string', title: 'Aviso menor' },
    pais: { type: 'string', title: 'País', enum: ['ar', 'uy', 'br'], enumNames: ['Argentina', 'Uruguay', 'Brasil'] },
    separador: { type: 'string', title: 'Datos de contacto' },
    email: { type: 'string', title: 'Email', format: 'email' },
    nota: { type: 'string', title: 'Importante' },
  },
};

const avisosUiSchema = {
  estado: {
    'ui:widget': 'BadgeWidget',
    'ui:options': { badgeLabel: 'Estado', bgColor: '#fef3c7', borderColor: '#f59e0b', valueColor: '#92400e', labelColor: '#92400e' },
  },
  avisoMenor: {
    'ui:widget': 'NoteWidget',
    'ui:options': {
      variant: 'warning',
      when: (data) => typeof data.edad === 'number' && data.edad < 18,
      title: 'Menor de edad',
      text: (data) => `Con ${data.edad} años se requiere autorización de un tutor.`,
    },
  },
  separador: { 'ui:widget': 'BadgeWidget', 'ui:options': { text: 'Datos de contacto' } },
  nota: {
    'ui:widget': 'NoteWidget',
    'ui:options': { variant: 'info', text: 'Revisá los datos antes de enviar: no se pueden editar después.' },
  },
};

export const TextosYBadgesEntreCampos = {
  render: () => {
    const [formData, setFormData] = useState({});
    return (
      <div style={{ maxWidth: 420 }}>
        <SchemaForm
          schema={avisosSchema}
          uiSchema={avisosUiSchema}
          formData={formData}
          validator={validator}
          onChange={setFormData}
        />
      </div>
    );
  },
};

export const TextosYBadgesEnDrawPanel = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Abrir panel</Button>
        <DrawPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Editar solicitud"
          width="440px"
          schema={avisosSchema}
          uiSchema={avisosUiSchema}
          confirmText="Guardar"
          onSubmit={() => setIsOpen(false)}
        />
      </>
    );
  },
};

// Personalización completa de NoteWidget / BadgeWidget: todas las variantes de Callout, paleta
// propia, íconos de lucide, badges con label + valor y textos/condiciones que dependen de formData.
const personalizadoSchema = {
  type: 'object',
  required: ['nombre'],
  properties: {
    badgePlan: { type: 'string' },
    nombre: { type: 'string', title: 'Nombre' },
    puntos: { type: 'integer', title: 'Puntos acumulados', minimum: 0 },
    badgeNivel: { type: 'string' },
    notaInfo: { type: 'string' },
    notaExito: { type: 'string' },
    notaAdvertencia: { type: 'string' },
    notaPeligro: { type: 'string' },
    notaNeutral: { type: 'string' },
    plan: { type: 'string', title: 'Plan', enum: ['free', 'pro'], enumNames: ['Gratis', 'Pro'] },
    notaPersonalizada: { type: 'string' },
    badgeVerificado: { type: 'string' },
  },
};

const nivelDe = (puntos = 0) => (puntos >= 1000 ? 'Oro' : puntos >= 500 ? 'Plata' : 'Bronce');

const personalizadoUiSchema = {
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
  badgeNivel: {
    'ui:widget': 'BadgeWidget',
    'ui:options': {
      icon: Gift,
      badgeLabel: 'Nivel',
      text: (d) => nivelDe(d.puntos),
      when: (d) => typeof d.puntos === 'number',
      bgColor: '#fffbeb',
      borderColor: '#fcd34d',
      valueColor: '#92400e',
    },
  },
  notaInfo: {
    'ui:widget': 'NoteWidget',
    'ui:options': { variant: 'info', title: 'Información', text: 'Los puntos se acreditan dentro de las 24 hs.' },
  },
  notaExito: {
    'ui:widget': 'NoteWidget',
    'ui:options': {
      variant: 'success',
      when: (d) => d.puntos >= 1000,
      title: '¡Nivel Oro!',
      text: (d) => `Con ${d.puntos} puntos accedés a todos los beneficios.`,
    },
  },
  notaAdvertencia: {
    'ui:widget': 'NoteWidget',
    'ui:options': {
      variant: 'warning',
      when: (d) => d.puntos > 0 && d.puntos < 100,
      text: 'Te faltan puntos para llegar a Plata.',
    },
  },
  notaPeligro: {
    'ui:widget': 'NoteWidget',
    'ui:options': {
      variant: 'danger',
      when: (d) => d.nombre && d.nombre.length < 2,
      title: 'Nombre demasiado corto',
      text: 'Ingresá al menos 2 caracteres.',
    },
  },
  notaNeutral: {
    'ui:widget': 'NoteWidget',
    'ui:options': { variant: 'neutral', text: 'Los campos marcados con ** son obligatorios.' },
  },
  notaPersonalizada: {
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
  badgeVerificado: {
    'ui:widget': 'BadgeWidget',
    'ui:options': {
      icon: Clock,
      iconColor: '#15803d',
      text: 'Cuenta verificada hoy',
      bgColor: '#f0fdf4',
      borderColor: '#86efac',
      valueColor: '#166534',
    },
  },
};

export const TextosYBadgesPersonalizados = {
  render: () => {
    const [formData, setFormData] = useState({ nombre: 'A', puntos: 50, plan: 'pro' });
    return (
      <div style={{ maxWidth: 460 }}>
        <SchemaForm
          schema={personalizadoSchema}
          uiSchema={personalizadoUiSchema}
          formData={formData}
          validator={validator}
          onChange={setFormData}
        />
      </div>
    );
  },
};
