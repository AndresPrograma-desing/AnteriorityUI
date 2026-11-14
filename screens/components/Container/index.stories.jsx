import React, { useState } from 'react';
import Container from './index';

export default {
  title: 'Components/Container',
  component: Container,
};

export const Default = {
  args: {
    children: <p>Contenido de ejemplo dentro del contenedor.</p>,
  },
};

export const WithPagination = {
  args: {
    children: <p>Lista de resultados paginados.</p>,
    showPagination: true,
    paginationCount: 50,
    paginationPage: 1,
    pageSize: 10,
    onPaginationChange: (page) => console.log('page changed', page),
    onPageSizeChange: (size) => console.log('page size changed', size),
  },
};

export const WithStepper = {
  render: () => {
    const [step, setStep] = useState(1);
    const steps = [{ label: 'Titular' }, { label: 'Ubicación' }, { label: 'Servicio' }, { label: 'Instalación' }, { label: 'Confirmar' }];
    return (
      <Container showStepper steps={steps} activeStep={step} onStepClick={setStep} style={{ minHeight: 320 }}>
        <p>Contenido del paso {step + 1}: {steps[step].label}.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>Anterior</button>
          <button type="button" disabled={step === steps.length - 1} onClick={() => setStep(step + 1)}>Siguiente</button>
        </div>
      </Container>
    );
  },
};

export const WithCustomStepper = {
  render: () => {
    const [step, setStep] = useState(2);
    const steps = [{ label: 'Titular' }, { label: 'Ubicación' }, { label: 'Servicio' }, { label: 'Confirmar' }];
    return (
      <Container
        showStepper
        steps={steps}
        activeStep={step}
        onStepClick={setStep}
        stepperProps={{ size: 36, accentColor: '#059669', haloColor: '#a7f3d0', lineActiveColor: '#059669' }}
        style={{ minHeight: 240 }}
      >
        <p>Stepper con props reenviadas por `stepperProps` (tamaño y colores).</p>
      </Container>
    );
  },
};

const CONTACT_SCHEMA = {
  type: 'object',
  required: ['nombre', 'email'],
  properties: {
    nombre: { type: 'string', title: 'Nombre' },
    email: { type: 'string', title: 'Email', format: 'email' },
    mensaje: { type: 'string', title: 'Mensaje' },
  },
};

// Formulario desde un JSON Schema, sin Stepper.
export const WithSchemaForm = {
  render: () => {
    const [data, setData] = useState({});
    const [sent, setSent] = useState(null);
    return (
      <Container
        header={<strong>Contacto</strong>}
        schema={CONTACT_SCHEMA}
        formData={data}
        onFormChange={setData}
        onFormSubmit={setSent}
        schemaFormProps={{ submitText: 'Enviar' }}
        style={{ minHeight: 320 }}
      >
        <p>Completá el formulario:</p>
        {sent && <pre>{JSON.stringify(sent, null, 2)}</pre>}
      </Container>
    );
  },
};

// Mismo formulario repartido en 2 columnas: `columnFlow: 'column'` llena primero la izquierda
// (campos 1-5) y luego la derecha (6-10); con 'row' (default) iría fila por fila. En un Container
// angosto (< 520px) vuelve a una sola columna.
const PERSON_SCHEMA = {
  type: 'object',
  required: ['nombre', 'apellido'],
  properties: {
    nombre: { type: 'string', title: 'Nombre' },
    apellido: { type: 'string', title: 'Apellido' },
    documento: { type: 'string', title: 'Documento' },
    email: { type: 'string', title: 'Email', format: 'email' },
    telefono: { type: 'string', title: 'Teléfono' },
    direccion: { type: 'string', title: 'Dirección' },
    ciudad: { type: 'string', title: 'Ciudad' },
    provincia: { type: 'string', title: 'Provincia' },
    codigoPostal: { type: 'string', title: 'Código postal' },
    pais: { type: 'string', title: 'País' },
  },
};

export const WithSchemaFormColumns = {
  name: 'Schema en 2 columnas',
  render: () => {
    const [data, setData] = useState({});
    return (
      <Container
        header={<strong>Alta de persona</strong>}
        schema={PERSON_SCHEMA}
        uiSchema={{ 'ui:options': { columns: 2, columnFlow: 'column' } }}
        formData={data}
        onFormChange={setData}
        onFormSubmit={(values) => console.log('submit', values)}
        schemaFormProps={{ submitText: 'Guardar' }}
        style={{ minHeight: 320 }}
      />
    );
  },
};

// Banner de marca de agua personalizado: texto propio + props reenviadas al `Barnner`.
export const WithCustomWatermark = {
  render: () => (
    <Container
      wattermark
      wattermarkText="Versión de prueba"
      wattermarkProps={{ bgColor: '#fef3c7', textColor: '#92400e', borderColor: '#fcd34d' }}
    >
      <p>Contenido con marca de agua propia.</p>
    </Container>
  ),
};

// Los inputs del Container van sin caja (underline) por defecto; para volver a la caja:
// `schemaFormProps={{ inputVariant: 'outlined' }}`.
export const WithSchemaFormOutlined = {
  name: 'Schema con inputs outlined (caja)',
  render: () => {
    const [data, setData] = useState({});
    return (
      <Container
        header={<strong>Alta de persona</strong>}
        schema={PERSON_SCHEMA}
        uiSchema={{ 'ui:options': { columns: 2, columnFlow: 'column' } }}
        formData={data}
        onFormChange={setData}
        schemaFormProps={{ inputVariant: 'outlined', submitText: 'Guardar' }}
        style={{ minHeight: 320 }}
      />
    );
  },
};

// `loading` oculta el Stepper, el formulario y la paginación y muestra un Loading en su lugar:
// ideal cuando los pasos y el schema llegan de un JSON que todavía se está pidiendo.
export const WithLoading = {
  name: 'Loading (espera el JSON)',
  render: () => {
    const [config, setConfig] = useState(null);
    const [step, setStep] = useState(0);
    const load = () => {
      setConfig(null);
      setTimeout(() => setConfig({
        steps: [
          { label: 'Contacto', schema: CONTACT_SCHEMA },
          { label: 'Detalle', schema: { type: 'object', properties: { motivo: { type: 'string', title: 'Motivo' } } } },
        ],
      }), 2000);
    };
    React.useEffect(load, []);
    return (
      <Container
        header={<button type="button" onClick={load}>Recargar JSON</button>}
        loading={!config}
        showStepper
        steps={config?.steps ?? []}
        activeStep={step}
        onStepClick={setStep}
        onFormSubmit={() => setStep((s) => Math.min(s + 1, 1))}
        schemaFormProps={{ submitText: 'Siguiente' }}
        style={{ minHeight: 360 }}
      />
    );
  },
};

// Un JSON por paso, pedido de a uno, y cada paso se guarda por separado (como contra una base de
// datos): `formLoading` muestra el skeleton solo en el lugar del formulario (el Stepper queda
// visible), `formDisabled` bloquea el formulario mientras se guarda y `onFormSubmit` entrega en su
// 3er argumento solo los datos del paso (`stepData`) además del índice (`step`).
const LAZY_STEP_SCHEMAS = {
  0: CONTACT_SCHEMA,
  1: { type: 'object', required: ['motivo'], properties: { motivo: { type: 'string', title: 'Motivo' }, detalle: { type: 'string', title: 'Detalle' } } },
  2: { type: 'object', properties: { acepta: { type: 'boolean', title: 'Acepto los términos' } } },
};
const fakeRequest = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const WithPerStepFetchAndSave = {
  name: 'Un JSON por paso + guardar cada paso',
  render: () => {
    const [step, setStep] = useState(0);
    const [schemas, setSchemas] = useState({});
    const [data, setData] = useState({});
    const [saving, setSaving] = useState(false);
    const [log, setLog] = useState([]);
    const steps = [{ label: 'Contacto' }, { label: 'Detalle' }, { label: 'Confirmar' }].map((item, index) => ({
      ...item,
      schema: schemas[index],
    }));

    // Pide el schema del paso la primera vez que se visita.
    React.useEffect(() => {
      if (schemas[step]) return;
      fakeRequest(LAZY_STEP_SCHEMAS[step], 1200).then((schema) => setSchemas((prev) => ({ ...prev, [step]: schema })));
    }, [step, schemas]);

    return (
      <Container
        showStepper
        steps={steps}
        activeStep={step}
        onStepClick={setStep}
        formLoading={!schemas[step]}
        formDisabled={saving}
        formData={data}
        onFormChange={(values) => setData(values)}
        onFormSubmit={async (values, _event, { step: current, stepData }) => {
          setSaving(true);
          await fakeRequest(null, 700); // api.saveStep(draftId, current, stepData)
          setSaving(false);
          setLog((prev) => [...prev, `PUT paso ${current}: ${JSON.stringify(stepData)}`]);
          setData(values);
          setStep((s) => Math.min(s + 1, steps.length - 1));
        }}
        schemaFormProps={{ submitText: saving ? 'Guardando...' : 'Guardar y continuar' }}
        style={{ minHeight: 380 }}
      >
        {log.length > 0 && <pre style={{ fontSize: 12, background: '#f1f5f9', padding: 8, borderRadius: 8 }}>{log.join(String.fromCharCode(10))}</pre>}
      </Container>
    );
  },
};

// Stepper + un schema por paso: el Container muestra el del paso activo.
export const WithStepperAndSchemaPerStep = {
  render: () => {
    const [step, setStep] = useState(0);
    const steps = [
      { label: 'Contacto', schema: CONTACT_SCHEMA },
      { label: 'Detalle', schema: { type: 'object', properties: { motivo: { type: 'string', title: 'Motivo' } } } },
    ];
    return (
      <Container
        showStepper
        steps={steps}
        activeStep={step}
        onStepClick={setStep}
        onFormSubmit={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
        schemaFormProps={{ submitText: 'Siguiente' }}
        style={{ minHeight: 360 }}
      />
    );
  },
};

// Wizard completo: Stepper + un schema por paso, datos acumulados entre pasos y resumen final.
const WIZARD_STEPS = [
  {
    label: 'Titular',
    title: 'Datos del titular',
    schema: {
      type: 'object',
      required: ['nombre', 'email'],
      properties: {
        nombre: { type: 'string', title: 'Nombre o razón social' },
        email: { type: 'string', title: 'Email de contacto', format: 'email' },
      },
    },
  },
  {
    label: 'Ubicación',
    title: 'Ubicación',
    schema: {
      type: 'object',
      required: ['direccion', 'ciudad'],
      properties: {
        direccion: { type: 'string', title: 'Dirección de la instalación' },
        ciudad: { type: 'string', title: 'Ciudad' },
      },
    },
  },
  {
    label: 'Servicio',
    title: 'Servicio',
    schema: {
      type: 'object',
      required: ['tipo'],
      properties: {
        tipo: { type: 'string', title: 'Tipo de conexión', enum: ['Residencial', 'Comercial', 'Industrial'] },
        urgente: { type: 'boolean', title: 'Instalación urgente' },
      },
    },
  },
  {
    label: 'Instalación',
    title: 'Instalación',
    schema: {
      type: 'object',
      required: ['fecha'],
      properties: {
        fecha: { type: 'string', title: 'Fecha preferida', format: 'date' },
        notas: { type: 'string', title: 'Notas para el técnico' },
      },
    },
  },
  {
    label: 'Confirmar',
    title: 'Confirmar',
    schema: {
      type: 'object',
      properties: { acepta: { type: 'boolean', title: 'Confirmo que los datos son correctos' } },
    },
  },
];

export const WizardAltaDeServicio = {
  name: 'Wizard (Stepper + schema por paso)',
  render: () => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({});
    const [finished, setFinished] = useState(false);
    const last = WIZARD_STEPS.length - 1;
    const restart = () => { setData({}); setFinished(false); setStep(0); };

    return (
      <Container
        showStepper
        steps={WIZARD_STEPS}
        activeStep={finished ? WIZARD_STEPS.length : step}
        onStepClick={(index) => { setFinished(false); setStep(index); }}
        header={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong>Alta de servicio</strong>
            {!finished && step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)}>Anterior</button>
            )}
          </div>
        }
        formData={data}
        onFormChange={(values) => setData((prev) => ({ ...prev, ...values }))}
        onFormSubmit={(values) => {
          setData((prev) => ({ ...prev, ...values }));
          if (step === last) setFinished(true);
          else setStep(step + 1);
        }}
        schemaFormProps={{ submitText: step === last ? 'Finalizar' : 'Siguiente' }}
        style={{ minHeight: 420 }}
      >
        <h2 style={{ margin: '0 0 12px' }}>
          {finished ? 'Solicitud enviada' : WIZARD_STEPS[step].title}
        </h2>
        {finished && (
          <div>
            <pre style={{ background: '#f1f5f9', padding: 12, borderRadius: 8 }}>{JSON.stringify(data, null, 2)}</pre>
            <button type="button" onClick={restart}>Empezar de nuevo</button>
          </div>
        )}
      </Container>
    );
  },
};

export const CustomClassName = {
  args: {
    children: <p>Contenedor con clase personalizada.</p>,
    className: 'custom-container',
  },
};

export const CustomBorder = {
  args: {
    children: <p>Contenedor con borde personalizado.</p>,
    borderColor: 'rgba(15, 23, 42, 0.2)',
  },
};

export const WithBackgroundImage = {
  args: {
    children: <p style={{ color: '#fff' }}>Contenedor con imagen de fondo.</p>,
    bgImage: 'https://picsum.photos/seed/anteriority/1300/700',
    style: { minHeight: '400px' },
  },
};

export const WithBlurredBackground = {
  args: {
    children: <p style={{ color: '#fff' }}>Contenedor con imagen de fondo difuminada.</p>,
    bgImage: 'https://picsum.photos/seed/anteriority/1300/700',
    blurBackground: true,
    style: { minHeight: '400px' },
  },
};


export const WithStickyHeader = {
  render: () => (
    <div style={{ height: 320, overflowY: 'auto', background: '#f8fafc', padding: 16 }}>
      <Container
        wattermark={false}
        header={<strong>Topbar del Container</strong>}
        style={{ minHeight: 0 }}
      >
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i}>Fila {i + 1}: al scrollear, el topbar queda fijo arriba.</p>
        ))}
      </Container>
    </div>
  ),
};
