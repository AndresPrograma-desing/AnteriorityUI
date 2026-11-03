import RenderJsonSchema from './index';

export default {
  title: 'Components/RenderJsonSchema',
  component: RenderJsonSchema,
};

const profileSchema = {
  type: 'object',
  properties: {
    nombre: { type: 'string', title: 'Nombre' },
    edad: { type: 'number', title: 'Edad' },
    pais: {
      type: 'string',
      title: 'País',
      enum: ['ar', 'uy', 'br'],
      enumNames: ['Argentina', 'Uruguay', 'Brasil'],
    },
    nacimiento: { type: 'string', title: 'Fecha de nacimiento', format: 'date' },
    activo: { type: 'boolean', title: 'Cuenta activa' },
    roles: {
      type: 'array',
      title: 'Roles',
      items: { type: 'string', enum: ['admin', 'editor', 'viewer'], enumNames: ['Admin', 'Editor', 'Viewer'] },
    },
    direccion: {
      type: 'object',
      title: 'Dirección',
      properties: {
        calle: { type: 'string', title: 'Calle' },
        ciudad: { type: 'string', title: 'Ciudad' },
      },
    },
    avatar: { type: 'string', format: 'data-url', title: 'Foto de perfil' },
  },
};

const AVATAR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzI1NjNlYiIvPjwvc3ZnPg==';

export const Default = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <RenderJsonSchema
        schema={profileSchema}
        formData={{
          nombre: 'Ignacio Angel',
          edad: 29,
          pais: 'ar',
          nacimiento: '1996-05-10',
          activo: true,
          roles: ['admin', 'editor'],
          direccion: { calle: 'Av. Siempre Viva 742', ciudad: 'Springfield' },
          avatar: AVATAR_DATA_URL,
        }}
      />
    </div>
  ),
};

export const SinDatos = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <RenderJsonSchema schema={profileSchema} formData={{}} />
    </div>
  ),
};

// Simula una respuesta vieja guardada por un widget roto (ej. el bug de
// DateWidget que antes guardaba el evento { target: { value } } entero en vez
// del string de fecha): el campo afectado se muestra vacío en lugar de romper
// o mostrar "[object Object]".
export const ConDatoViejoCorrupto = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <RenderJsonSchema
        schema={profileSchema}
        formData={{
          nombre: 'Usuario Legacy',
          nacimiento: { target: { name: 'nacimiento', value: '1990-01-01', type: 'date' } },
          activo: true,
        }}
      />
    </div>
  ),
};

const documentoSchema = {
  type: 'object',
  properties: {
    nombre: { type: 'string', title: 'Nombre del documento' },
    avatar: { type: 'string', format: 'data-url', title: 'Foto de perfil' },
  },
};

export const ConImagen = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <RenderJsonSchema
        schema={documentoSchema}
        formData={{
          nombre: 'Documento de ejemplo',
          avatar: AVATAR_DATA_URL,
        }}
      />
    </div>
  ),
};

// Genera un WAV de un segundo (tono de 440 Hz) como data-URL, para ejemplificar un audio ya
// guardado sin depender de un archivo externo — es el mismo formato (`data:audio/...;base64,...`)
// que guarda el AudioWidget de SchemaForm al grabar.
function createToneDataURL(seconds = 1, frequency = 440, sampleRate = 8000) {
  const samples = seconds * sampleRate;
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  const writeText = (offset, text) =>
    [...text].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));

  writeText(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, 'data');
  view.setUint32(40, samples * 2, true);
  for (let i = 0; i < samples; i += 1) {
    view.setInt16(44 + i * 2, Math.sin((2 * Math.PI * frequency * i) / sampleRate) * 0.3 * 32767, true);
  }

  let binary = '';
  new Uint8Array(buffer).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `data:audio/wav;base64,${btoa(binary)}`;
}

const audioSchema = {
  type: 'object',
  properties: {
    nombre: { type: 'string', title: 'Nombre del registro' },
    nota: { type: 'string', format: 'data-url', title: 'Nota de voz' },
  },
};

export const ConAudio = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <RenderJsonSchema
        schema={audioSchema}
        formData={{ nombre: 'Registro de ejemplo', nota: createToneDataURL() }}
      />
    </div>
  ),
};

export const ConAudioTemaOscuro = {
  render: () => (
    <div style={{ maxWidth: 420, background: '#0b1120', padding: '1rem' }}>
      <RenderJsonSchema
        schema={audioSchema}
        formData={{ nombre: 'Registro de ejemplo', nota: createToneDataURL() }}
        bgColor="#111827"
        textColor="#f1f5f9"
        labelColor="#94a3b8"
        borderColor="#1f2937"
      />
    </div>
  ),
};

// Mismo panel con paleta oscura vía las props de color opcionales (bgColor/
// textColor/labelColor/borderColor): también oscurece el MediaViewer interno
// del campo avatar (sus colores se propagan, no se heredan solos por CSS).
export const TemaOscuro = {
  render: () => (
    <div style={{ maxWidth: 420, background: '#0b1120', padding: '1rem' }}>
      <RenderJsonSchema
        schema={profileSchema}
        formData={{
          nombre: 'Ignacio Angel',
          edad: 29,
          pais: 'ar',
          nacimiento: '1996-05-10',
          activo: true,
          roles: ['admin', 'editor'],
          direccion: { calle: 'Av. Siempre Viva 742', ciudad: 'Springfield' },
          avatar: AVATAR_DATA_URL,
        }}
        bgColor="#111827"
        textColor="#f1f5f9"
        labelColor="#94a3b8"
        borderColor="#1f2937"
      />
    </div>
  ),
};
