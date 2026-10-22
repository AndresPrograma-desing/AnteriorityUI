import { useState } from 'react';
import { Bell, HelpCircle, Home, FileText, Settings, Users, LogOut, User, Rocket } from 'lucide-react';
import AppShell from './index';

export default {
  title: 'Components/AppShell',
  component: AppShell,
};

// `logo`/`headerContent` aceptan cualquier node: un ícono de una librería
// (lucide-react, react-icons, etc.), un <svg> propio o un <img src="..." />
// con el logo real de la empresa/app.
const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
    <Rocket size={22} color="#0d52f8" />
    <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Acme</span>
  </div>
);

const groups = [
  {
    title: 'General',
    items: [
      { id: 'home', label: 'Inicio', icon: Home },
      { id: 'docs', label: 'Documentos', icon: FileText },
      { id: 'team', label: 'Equipo', icon: Users },
    ],
  },
  {
    title: 'Configuración',
    items: [
      { id: 'settings', label: 'Ajustes', icon: Settings },
    ],
  },
];

const userMenuItems = [
  { id: 'profile', label: 'Mi perfil', icon: User, onClick: () => console.log('profile clicked') },
  { id: 'logout', label: 'Cerrar sesión', icon: LogOut, variant: 'danger', onClick: () => console.log('logout clicked') },
];

const actions = [
  { key: 'notifications', icon: Bell, tooltip: 'Notificaciones', badge: 2, onClick: () => console.log('notifications') },
  { key: 'help', icon: HelpCircle, tooltip: 'Ayuda', onClick: () => console.log('help') },
];

const AppShellWithState = (args) => {
  const [activeId, setActiveId] = useState('home');
  return (
    <AppShell
      {...args}
      sidebarProps={{
        groups,
        activeId,
        onSelect: (item) => setActiveId(item.id),
        headerContent: <Logo />,
        user: { email: 'jane.doe@example.com' },
        userMenuItems,
        ...args.sidebarProps,
      }}
    />
  );
};

export const Default = {
  render: (args) => <AppShellWithState {...args} />,
  args: {
    topBarProps: {
      logo: <Logo />,
      title: 'Panel de control',
      actions,
      user: { email: 'jane.doe@example.com' },
    },
    useContainer: true,
    children: (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Contenido de la página</h2>
        <p>Todo lo que se pase como children de AppShell se renderiza acá, con scroll propio.</p>
        <p>Con <code>useContainer</code>, AppShell envuelve este contenido en un <code>Container</code> automáticamente (marco con borde/sombra), sin que el consumidor tenga que importarlo aparte.</p>
      </div>
    ),
  },
};

export const CustomContentBackground = {
  render: (args) => <AppShellWithState {...args} />,
  args: {
    contentBgColor: '#eef2ff',
    topBarProps: {
      logo: <Logo />,
      title: 'Reportes',
      user: { email: 'jane.doe@example.com' },
    },
    useContainer: true,
    containerProps: { borderColor: '#6366f1' },
    children: (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Fondo de contenido personalizado</h2>
        <p>contentBgColor cambia el fondo del área scrolleable, sin tocar Sidebar ni TopBar. containerProps se pasa tal cual al Container interno (acá, borderColor).</p>
      </div>
    ),
  },
};
