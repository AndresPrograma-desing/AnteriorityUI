import { useState } from 'react';
import { BookOpen, Bell, ExternalLink, HelpCircle, LogOut, User } from 'lucide-react';
import logoUrl from '../assets/anteriorityUI/anteriority-logo.svg';
import AppShell from '../screens/components/AppShell/index';
import Footer from '../screens/components/Footer/index';
import Container from '../screens/components/Container/index';
import Frame from '../screens/components/Frame/index';
import Button from '../screens/components/Button/index';
import { DEMOS, buildGroups } from './demos';
import {
  APP_NAME,
  DEMO_USER_EMAIL,
  FOOTER_TEXT,
  REPO_URL,
  STORIES_FRAME_TEXT,
  STORIES_URL,
  TOPBAR_TOOLTIPS,
  USER_MENU_LABELS,
} from './constants.js';

export default {
  title: 'Playground/AppShell',
  component: AppShell,
  // AppShell ocupa 100vh: sin fullscreen, el padding de Storybook hace desbordar la página.
  parameters: { layout: 'fullscreen' },
};

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
    <img src={logoUrl} alt={APP_NAME} style={{ height: 28, width: 'auto' }} />
    <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{APP_NAME}</span>
  </div>
);

const userMenuItems = [
  { id: 'profile', label: USER_MENU_LABELS.profile, icon: User, onClick: () => console.log('profile clicked') },
  { id: 'logout', label: USER_MENU_LABELS.logout, icon: LogOut, variant: 'danger', onClick: () => console.log('logout clicked') },
];

const actions = (onOpenStories) => [
  { key: 'stories', icon: BookOpen, tooltip: TOPBAR_TOOLTIPS.stories, onClick: onOpenStories },
  { key: 'notifications', icon: Bell, tooltip: TOPBAR_TOOLTIPS.notifications, badge: 2, onClick: () => console.log('notifications') },
  { key: 'help', icon: HelpCircle, tooltip: TOPBAR_TOOLTIPS.help, onClick: () => console.log('help') },
];

// --- Playground: AppShell global para ver cualquier componente con el layout real ---
// El menú lateral sale de `./demos.jsx`: para ver otro componente, agregá una entrada ahí.

const PlaygroundShell = () => {
  const [activeId, setActiveId] = useState(DEMOS[0].id);
  const [storiesOpen, setStoriesOpen] = useState(false);
  const active = DEMOS.find((demo) => demo.id === activeId) || DEMOS[0];
  const Demo = active.render;

  return (
    <AppShell
      sidebarProps={{
        groups: buildGroups(),
        activeId,
        onSelect: (item) => setActiveId(item.id),
        headerContent: <Logo />,
        user: { email: DEMO_USER_EMAIL },
        userMenuItems,
      }}
      topBarProps={{ logo: <Logo />, title: active.label, actions: actions(() => setStoriesOpen(true)), user: { email: DEMO_USER_EMAIL } }}
    >
      {/* Contenido + Footer pegado abajo del área con scroll (sticky): si el contenido es corto, el footer queda al fondo. */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <div style={{ flex: 1, padding: '1.5rem' }}>
          {active.ownContainer ? (
            <Demo key={active.id} />
          ) : (
            <Container wattermark={false} header={<strong>{active.label}</strong>}>
              <div style={{ padding: '1rem 0' }}>
                <Demo key={active.id} />
              </div>
            </Container>
          )}
        </div>
        <Footer
          sticky
          height={64}
          left={`${FOOTER_TEXT.leftPrefix} · ${active.label}`}
          actions={[
            { key: 'repo', label: FOOTER_TEXT.repoAction, onClick: () => window.open(REPO_URL, '_blank', 'noopener,noreferrer') },
          ]}
        />
      </div>
      {storiesOpen && (
        <Frame
          isModal
          onClose={() => setStoriesOpen(false)}
          title={STORIES_FRAME_TEXT.title}
          icon={<BookOpen size={20} />}
          content={STORIES_FRAME_TEXT.content}
        >
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button variant="ghost" onClick={() => setStoriesOpen(false)}>{STORIES_FRAME_TEXT.close}</Button>
            <Button icon={ExternalLink} onClick={() => window.open(STORIES_URL, '_blank', 'noopener,noreferrer')}>{STORIES_FRAME_TEXT.open}</Button>
          </div>
        </Frame>
      )}
    </AppShell>
  );
};

export const Playground = {
  render: () => <PlaygroundShell />,
};
