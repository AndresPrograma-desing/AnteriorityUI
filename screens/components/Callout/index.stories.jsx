import Callout from './index';
import Button from '../Button/index';

export default {
  title: 'Components/Callout',
  component: Callout,
};

export const Info = {
  args: {
    variant: 'info',
    title: 'Dato útil',
    children: 'Podés invitar a más miembros del equipo desde **Configuración → Equipo**.',
  },
};

export const Warning = {
  args: {
    variant: 'warning',
    title: 'Advertencia',
    children: 'Esta acción afecta a **todos los usuarios** del workspace. Revisá los cambios antes de confirmar.',
  },
};

export const Danger = {
  args: {
    variant: 'danger',
    title: 'Error al guardar',
    children: 'No se pudo conectar con el servidor. Verificá tu conexión e intentá nuevamente.',
  },
};

export const Success = {
  args: {
    variant: 'success',
    title: 'Listo',
    children: 'Los cambios se guardaron correctamente.',
  },
};

export const Neutral = {
  args: {
    variant: 'neutral',
    title: 'Nota',
    children: 'Este es un aviso sin color asociado a ningún estado en particular.',
  },
};

export const MarkdownCompleto = {
  args: {
    variant: 'warning',
    title: 'Antes de continuar',
    children: `Revisá los siguientes puntos:

- La migración **no es reversible**
- Hacé un backup desde \`Configuración → Backups\`
- Más info en la [documentación oficial](https://example.com/docs)

\`\`\`js
await db.migrate({ dryRun: false });
\`\`\`
`,
  },
};

export const ConAcciones = {
  args: {
    variant: 'danger',
    title: 'Eliminar cuenta',
    children: 'Esta acción es permanente y no se puede deshacer.',
    actions: (
      <>
        <Button size="small" variant={Button.VARIANTS.DANGER}>Eliminar</Button>
        <Button size="small" variant={Button.VARIANTS.GHOST}>Cancelar</Button>
      </>
    ),
  },
};

export const Cerrable = {
  args: {
    variant: 'info',
    title: 'Nueva función disponible',
    children: 'Ahora podés exportar tus reportes en formato CSV.',
    onClose: () => console.log('cerrado'),
  },
};

export const ColoresPersonalizados = {
  args: {
    variant: 'info',
    title: 'Con colores custom',
    children: 'Los colores de fondo, borde, ícono y texto se pueden pisar sin perder la paleta del variant.',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    textColor: '#6d28d9',
    iconColor: '#7c3aed',
  },
};
