import { useState } from 'react';
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
    edad: { type: 'number', title: 'Edad' },
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
  nacimiento: { 'ui:widget': 'DateWidget' },
  avatar: { 'ui:options': { accept: 'image/*' } },
  adjuntos: { 'ui:options': { multiple: true } },
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
