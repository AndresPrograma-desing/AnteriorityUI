import { useEffect, useRef, useState } from 'react';
import DrawPanel from './index.jsx';
import Callout from '../Callout/index.jsx';
import Button from '../Button/index.jsx';
import JsonProgressDemo from './stories/JsonProgressDemo';
import {
  MedalIcon, Star, ShieldCheck, Gift, Send, Database, PackageCheck,
  LogIn, KeyRound, FileText, Sparkles, Calculator, FileCheck, Ticket, Receipt, PenLine, Lock,
  CloudUpload, CheckCheck, ClipboardList, Bell,
} from 'lucide-react';

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

// Stepper vertical como seguimiento de un envío: el usuario completa el formulario, lo envía y el
// panel va avanzando solo paso a paso (iniciando → recolectando datos → validando → entregado).
// Cada paso trae su propio ícono SVG (`icon`); el paso en curso lo conserva y se marca con un aro que
// gira (`activeLoading`). Acá se simula con timers; en la app real `activeStep` se actualiza con los eventos del backend
// (polling, websocket, respuesta de cada etapa...). `activeStep === steps.length` = todo completado.
const SEND_STEPS = [
  { label: 'Iniciando envío', description: 'Preparando la solicitud', icon: <Send /> },
  { label: 'Recolectando datos', description: 'Reuniendo la información del formulario', icon: <Database /> },
  { label: 'Validando', description: 'Verificando que todo esté correcto', icon: <ShieldCheck /> },
  { label: 'Entregado', description: 'La solicitud llegó a destino', icon: <PackageCheck /> },
];
const SEND_SCHEMA = {
  type: 'object',
  required: ['nombre', 'email'],
  properties: {
    nombre: { type: 'string', title: 'Nombre' },
    email: { type: 'string', title: 'Email', format: 'email' },
  },
};

export const ConStepperProgreso = {
  name: 'Con Stepper vertical (progreso de envío)',
  render: () => {
    const [open, setOpen] = useState(true);
    const [phase, setPhase] = useState('form'); // 'form' | 'sending' | 'done' | 'error'
    const [step, setStep] = useState(0);
    const [failAtValidation, setFailAtValidation] = useState(false);
    const timers = useRef([]);

    const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
    const reset = () => { clearTimers(); setPhase('form'); setStep(0); };

    // Cada etapa termina a los 1,4 s. Con "simular fallo", la etapa 3 (Validando) falla: el paso
    // queda con `error`, el proceso se detiene ahí y el footer ofrece Reintentar / Cerrar.
    const start = () => {
      clearTimers();
      setPhase('sending');
      setStep(0);
      SEND_STEPS.forEach((_, index) => {
        timers.current.push(setTimeout(() => {
          if (failAtValidation && index === 2) {
            setStep(2);
            setPhase('error');
            return;
          }
          setStep(index + 1); // completa el paso `index` y pasa al siguiente
          if (index === SEND_STEPS.length - 1) setPhase('done');
        }, (index + 1) * 1400));
      });
    };
    const failed = phase === 'error';
    const steps = SEND_STEPS.map((item, index) => ({ ...item, error: failed && index === step }));

    return (
      <>
        <Button onClick={() => { reset(); setOpen(true); }}>Abrir panel</Button>
        <DrawPanel
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Nueva solicitud"
          description={phase === 'form' ? 'Completá los datos y enviá' : 'Seguimiento del envío'}
          showStepper={phase !== 'form'}
          steps={steps}
          activeStep={step}
          stepperProps={{ activeLoading: phase === 'sending' }}
          schema={phase === 'form' ? SEND_SCHEMA : undefined}
          onSubmit={start}
          confirmText={failed ? 'Reintentar' : 'Enviar'}
          onConfirm={failed ? start : undefined}
          cancelText={phase === 'form' ? 'Cancelar' : 'Cerrar'}
          // Footer: en el formulario Cancelar/Enviar; enviando sin botones; al terminar solo Cerrar;
          // si falla, Reintentar + Cerrar.
          showActions={phase !== 'sending'}
          showConfirmButton={phase === 'form' || failed}
        >
          {phase === 'form' && (
            <label style={{ display: 'block', marginTop: 16, fontSize: 14 }}>
              <input type="checkbox" checked={failAtValidation} onChange={(e) => setFailAtValidation(e.target.checked)} />{' '}
              Simular fallo en "Validando"
            </label>
          )}
          {phase === 'done' && <p style={{ margin: 0 }}>¡Solicitud entregada!</p>}
          {failed && (
            <p style={{ margin: 0, color: '#dc2626' }}>
              No se pudo validar la solicitud. Los pasos anteriores se completaron; podés reintentar.
            </p>
          )}
        </DrawPanel>
      </>
    );
  },
};

// 15 etapas con dos fallos: falla la 6 y la 11. En cada fallo el footer ofrece "Reintentar", que
// retoma desde la etapa que falló (no desde cero); en el reintento esa etapa pasa y el proceso sigue
// hasta el siguiente fallo o hasta el final. Con tantas etapas el contenido del panel hace scroll y
// la story lleva la etapa en curso al centro.
const LONG_STEP_DEFS = [
  ['Iniciando sesión', LogIn], ['Verificando permisos', KeyRound], ['Leyendo formulario', FileText],
  ['Normalizando datos', Sparkles], ['Calculando totales', Calculator], ['Validando documentos', FileCheck],
  ['Reservando cupo', Ticket], ['Generando comprobante', Receipt], ['Firmando solicitud', PenLine],
  ['Cifrando adjuntos', Lock], ['Enviando al servidor', CloudUpload], ['Confirmando recepción', CheckCheck],
  ['Registrando auditoría', ClipboardList], ['Notificando al equipo', Bell], ['Entregando resultado', PackageCheck],
];
// Duración (ms) de cada etapa: rápidas por defecto y tres que tardan más, como un request real
// (permisos, firma y envío al servidor). La duración corre antes de completarse o de fallar.
const LONG_DEFAULT_MS = 600;
const LONG_STEP_MS = { 1: 2200, 8: 3000, 10: 3500 };
const LONG_FAIL_AT = { 5: 'El documento no pudo validarse (tiempo de espera agotado).', 10: 'El servidor no respondió. Intentá de nuevo.' };
// `icon` acepta un componente (acá, íconos de lucide) además de un elemento, una URL o un SVG.
const LONG_STEPS = LONG_STEP_DEFS.map(([label, icon]) => ({ label, icon }));

export const ConStepperFallosYReintento = {
  name: 'Stepper de 15 etapas con fallos y reintento',
  render: () => {
    const [open, setOpen] = useState(true);
    const [phase, setPhase] = useState('idle'); // 'idle' | 'running' | 'error' | 'done'
    const [step, setStep] = useState(0);
    const passed = useRef(new Set()); // etapas que ya fallaron una vez: en el reintento pasan
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);
    // Lleva la etapa en curso al centro del panel (el contenido hace scroll).
    useEffect(() => {
      const target = phase === 'done'
        ? document.querySelector('ol[aria-label="Progreso"] > li:last-child')
        : document.querySelector('[aria-current="step"]');
      target?.scrollIntoView({ block: phase === 'done' ? 'end' : 'center', behavior: 'smooth' });
    }, [step, phase]);

    const run = (from) => {
      clearTimeout(timer.current);
      setPhase('running');
      setStep(from);
      const advance = (index) => {
        timer.current = setTimeout(() => {
          if (LONG_FAIL_AT[index] && !passed.current.has(index)) {
            passed.current.add(index);
            setStep(index);
            setPhase('error');
            return;
          }
          setStep(index + 1);
          if (index === LONG_STEPS.length - 1) setPhase('done');
          else advance(index + 1);
        }, LONG_STEP_MS[index] ?? LONG_DEFAULT_MS);
      };
      advance(from);
    };
    const reset = () => { clearTimeout(timer.current); passed.current = new Set(); setPhase('idle'); setStep(0); };

    const failed = phase === 'error';
    const steps = LONG_STEPS.map((item, index) => ({ ...item, error: failed && index === step }));

    return (
      <>
        <Button onClick={() => { reset(); setOpen(true); }}>Abrir panel</Button>
        <DrawPanel
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Procesando solicitud"
          description={`Etapa ${Math.min(step + 1, LONG_STEPS.length)} de ${LONG_STEPS.length}`}
          showStepper
          steps={steps}
          activeStep={step}
          stepperProps={{ activeLoading: phase === 'running', stepGap: 22 }}
          confirmText={failed ? 'Reintentar' : 'Iniciar envío'}
          onConfirm={() => run(failed ? step : 0)}
          cancelText={phase === 'idle' ? 'Cancelar' : 'Cerrar'}
          showActions={phase !== 'running'}
          showConfirmButton={phase === 'idle' || failed}
        >
          {failed && (
            <p style={{ margin: '12px 0 0', color: '#dc2626' }}>
              Falló la etapa {step + 1} ({LONG_STEPS[step].label}): {LONG_FAIL_AT[step]}
            </p>
          )}
          {phase === 'done' && <p style={{ margin: '12px 0 0' }}>¡Solicitud entregada! Todas las etapas se completaron.</p>}
        </DrawPanel>
      </>
    );
  },
};

// Formulario por JSON Schema + seguimiento del envío con Stepper vertical, todo desde un JSON que
// se puede editar (schema, etapas, duración y qué etapas fallan). Formato en ./stories/presets.js.
export const ConJsonEditable = {
  name: 'JSON editable (formulario + progreso)',
  parameters: { layout: 'fullscreen' },
  render: () => <JsonProgressDemo />,
};
