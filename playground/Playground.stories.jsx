import { useState } from 'react';
import { Bell, HelpCircle, LogOut, User } from 'lucide-react';
import logoUrl from '../assets/anteriorityUI/anteriority-logo.svg';
import AppShell from '../screens/components/AppShell/index';
import Footer from '../screens/components/Footer/index';
import { DEMOS, buildGroups } from './demos';

export default {
  title: 'Playground/AppShell',
  component: AppShell,
  // AppShell ocupa 100vh: sin fullscreen, el padding de Storybook hace desbordar la página.
  parameters: { layout: 'fullscreen' },
};

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
    <img src={logoUrl} alt="AnteriorityUI" style={{ height: 28, width: 'auto' }} />
    <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>AnteriorityUI</span>
  </div>
);

const userMenuItems = [
  { id: 'profile', label: 'Mi perfil', icon: User, onClick: () => console.log('profile clicked') },
  { id: 'logout', label: 'Cerrar sesión', icon: LogOut, variant: 'danger', onClick: () => console.log('logout clicked') },
];

const actions = [
  { key: 'notifications', icon: Bell, tooltip: 'Notificaciones', badge: 2, onClick: () => console.log('notifications') },
  { key: 'help', icon: HelpCircle, tooltip: 'Ayuda', onClick: () => console.log('help') },
];

// --- Playground: AppShell global para ver cualquier componente con el layout real ---
// El menú lateral sale de `./demos.jsx`: para ver otro componente, agregá una entrada ahí.

const REPO_URL = 'https://github.com/AndresPrograma-desing/AnteriorityUI';

const PlaygroundShell = () => {
  const [activeId, setActiveId] = useState(DEMOS[0].id);
  const active = DEMOS.find((demo) => demo.id === activeId) || DEMOS[0];
  const Demo = active.render;

  return (
    <AppShell
      sidebarProps={{
        groups: buildGroups(),
        activeId,
        onSelect: (item) => setActiveId(item.id),
        headerContent: <Logo />,
        user: { email: 'anteriorityui@example.com' },
        userMenuItems,
      }}
      topBarProps={{ logo: <Logo />, title: active.label, actions, user: { email:'anteriorityui@example.com' } }}
    >
      {/* Contenido + Footer pegado abajo del área con scroll (sticky): si el contenido es corto, el footer queda al fondo. */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <div style={{ flex: 1, padding: '1.5rem' }}>
          <Demo key={active.id} />
        </div>
        <Footer
          sticky
          height={64}
          left={`Playground · ${active.label}`}
          actions={[
            { key: 'repo', label: 'Ver en GitHub', onClick: () => window.open(REPO_URL, '_blank', 'noopener,noreferrer') },
          ]}
        />
      </div>
    </AppShell>
  );
};

export const Playground = {
  render: () => <PlaygroundShell />,
};
