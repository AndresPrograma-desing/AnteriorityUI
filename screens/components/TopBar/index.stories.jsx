import React, { useState } from 'react';
import { Bell, MessageCircle, HelpCircle, LogOut, User, Settings, Folder, FileText, Home, FolderKanban } from 'lucide-react';
import { SiPubg } from 'react-icons/si';
import TopBar from './index.jsx';
import ProSidebar from '../Sidebar/index.jsx';

export default {
  title: 'Components/TopBar',
  component: TopBar,
};

// `logo` acepta cualquier node: un ícono de una librería (lucide-react,
// react-icons/si, etc.), un <svg> propio o un <img src="..." /> con el
// logo real de la empresa/app.
const Logo = () => <SiPubg size={28} color="#f2a900" />;

const breadcrumbItems = [
  { label: 'Mi Empresa', onClick: () => console.log('empresa clicked') },
  { label: 'Proyecto' },
  { label: 'wedrfghjhgfdsdfghjkjhgfghjk' },
  { label: 'qwertyuiopasdfghjklzxcvbnmqwertyu' },
];

const actions = [
  { key: 'messages', icon: MessageCircle, tooltip: 'Mensajes', badge: 2, onClick: () => console.log('messages') },
  { key: 'notifications', icon: Bell, tooltip: 'Notificaciones', badge: 3, onClick: () => console.log('notifications') },
  { key: 'help', icon: HelpCircle, tooltip: 'Ayuda', onClick: () => console.log('help') },
];

const commandItems = [
  { id: 's1', label: 'Gubernamentales-API', category: 'Sesiones', icon: Folder, onSelect: () => console.log('Gubernamentales-API') },
  { id: 's2', label: 'Proyecto', category: 'Sesiones', icon: Folder, onSelect: () => console.log('Proyecto') },
  { id: 'p1', label: 'EDENOR', category: 'Proyectos', icon: Folder, onSelect: () => console.log('EDENOR') },
  { id: 'p2', label: 'reunir', category: 'Proyectos', icon: Folder, onSelect: () => console.log('reunir') },
  { id: 'p3', label: 'PROYECTO', category: 'Proyectos', icon: Folder, onSelect: () => console.log('PROYECTO') },
  { id: 'p4', label: 'Kortech-Camuzzi', category: 'Proyectos', icon: Folder, onSelect: () => console.log('Kortech-Camuzzi') },
  { id: 'd1', label: 'Informe mensual.pdf', category: 'Documentos', icon: FileText, description: 'Modificado hoy', onSelect: () => console.log('doc') },
];

const userMenuItems = [
  { id: 'profile', label: 'Mi perfil', icon: User, onClick: () => console.log('profile') },
  { id: 'settings', label: 'Configuración', icon: Settings, onClick: () => console.log('settings') },
  { id: 'logout', label: 'Cerrar sesión', icon: LogOut, variant: 'danger', onClick: () => console.log('logout') },
];

const SearchWithState = (args) => {
  const [value, setValue] = useState('');
  return (
    <TopBar
      {...args}
      searchProps={{
        value,
        onChange: (e) => setValue(e.target.value),
        placeholder: 'Buscar...',
      }}
    />
  );
};

export const Default = {
  render: (args) => <SearchWithState {...args} />,
  args: {
    logo: <Logo />,
    breadcrumbItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    userMenuItems,
  },
};

export const WithTitle = {
  args: {
    logo: <Logo />,
    title: 'Panel de administración',
    actions,
    user: { email: 'jane.doe@example.com' },
    userMenuItems,
  },
};

export const WithoutSearch = {
  args: {
    logo: <Logo />,
    breadcrumbItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    userMenuItems,
  },
};

export const CustomColors = {
  render: (args) => <SearchWithState {...args} />,
  args: {
    logo: <Logo />,
    breadcrumbItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    userMenuItems,
    bgColor: '#0d1117',
    textColor: '#e6edf3',
    borderColor: '#30363d',
    iconColor: '#9198a1',
    accentColor: '#2f81f7',
    searchBgColor: '#161b22',
    breadcrumbLinkColor: '#9198a1',
  },
};

export const MinimalActionsOnly = {
  args: {
    logo: <Logo />,
    title: 'Mi App',
    actions: [
      { key: 'notifications', icon: Bell, tooltip: 'Notificaciones', onClick: () => console.log('notifications') },
    ],
  },
};

export const BadgeVariants = {
  args: {
    logo: <Logo />,
    title: 'Mi App',
    actions: [
      { key: 'dot', icon: Bell, tooltip: 'Badge tipo punto (badge: true)', badge: true, onClick: () => {} },
      { key: 'count', icon: MessageCircle, tooltip: 'Badge con número (badge: 3)', badge: 3, onClick: () => {} },
      { key: 'count-99', icon: Bell, tooltip: 'Badge con número grande (badge: 99)', badge: 99, onClick: () => {} },
      { key: 'text', icon: HelpCircle, tooltip: 'Badge con texto libre (badge: "Nuevo")', badge: 'Nuevo', onClick: () => {} },
      { key: 'none', icon: Settings, tooltip: 'Sin badge', onClick: () => {} },
    ],
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    userMenuItems,
  },
};

// `logo` no está atado a ninguna librería de íconos ni formato: acepta
// cualquier node, desde un ícono importado hasta un SVG propio o una
// imagen real de la empresa/app servida por URL.
export const LogoVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      <TopBar logo={<SiPubg size={26} color="#f2a900" />} title="Ícono de react-icons/si" />
      <TopBar
        logo={
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="6" fill="#0ea5e9" />
            <path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        }
        title="SVG propio inline"
      />
      <TopBar
        logo={<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeYwtCqhPip1gsffWrU9_CWkQvLUMaSL_S8Zy6-AaIXA&s=10" alt="Logo de la app" width={28} height={28} style={{ borderRadius: 6 }} />}
        title="Imagen (<img>) por URL"
      />
    </div>
  ),
};

// Por debajo de 1024px el buscador se achica; por debajo de 768px el buscador
// central se reemplaza por un botón de lupa (abre CommandPalette si hay
// `commandItems`, o un input expandido si hay `searchProps`), y las `actions`
// individuales se reemplazan por un botón "···" que las agrupa en un panel
// lateral (MobileActionsPanel). El breadcrumb/título truncan con max-width en
// vez de desbordar. Achicá la ventana del navegador por debajo de 767px para
// ver la transición completa.
export const Responsive = {
  render: (args) => <SearchWithState {...args} />,
  args: {
    logo: <Logo />,
    breadcrumbItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    userMenuItems,
  },
};

// Mismo caso que `Responsive` pero con `commandItems`: por debajo de 767px la
// lupa abre directo el CommandPalette (Ctrl+K) en vez del input expandido.
export const MobileActionsAndCommandPalette = {
  args: {
    logo: <Logo />,
    breadcrumbItems,
    commandItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    userMenuItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Achicá la ventana del navegador por debajo de 767px: aparecen el botón de lupa (abre el CommandPalette) y el botón "···" (abre el panel con mensajes/notificaciones/ayuda) a la derecha.',
      },
    },
  },
};

export const Loading = {
  args: {
    loading: true,
    logo: <Logo />,
    breadcrumbItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
  },
};

export const LoadingWithTitle = {
  args: {
    loading: true,
    logo: <Logo />,
    title: 'Panel de administración',
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
  },
};

export const LoadingWithoutSearch = {
  args: {
    loading: true,
    logo: <Logo />,
    breadcrumbItems,
    searchProps: false,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
  },
};

export const LoadingDark = {
  args: {
    loading: true,
    logo: <Logo />,
    breadcrumbItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    bgColor: '#0d1117',
    textColor: '#e6edf3',
    borderColor: '#30363d',
    dividerColor: '#30363d',
  },
};

export const LoadingMinimal = {
  args: {
    loading: true,
  },
};

export const LoadingToggleInteractive = {
  render: () => {
    const [isLoading, setIsLoading] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button
            type="button"
            onClick={() => setIsLoading((prev) => !prev)}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {isLoading ? 'Simular fin de carga (loaded)' : 'Simular estado de carga (loading)'}
          </button>
        </div>
        <TopBar
          loading={isLoading}
          logo={<Logo />}
          breadcrumbItems={breadcrumbItems}
          searchProps={{
            value: '',
            onChange: () => {},
            placeholder: 'Buscar...',
          }}
          actions={actions}
          user={{ name: 'Jane Doe', email: 'jane.doe@example.com' }}
          userMenuItems={userMenuItems}
        />
      </div>
    );
  },
};

export const ActionHoverDisabled = {
  render: (args) => <SearchWithState {...args} />,
  args: {
    logo: <Logo />,
    breadcrumbItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    actionHover: false,
  },
};

export const ActionCustomHoverAndRipple = {
  render: (args) => <SearchWithState {...args} />,
  args: {
    logo: <Logo />,
    breadcrumbItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    actionHoverBgColor: '#dbeafe',
    actionHoverTextColor: '#1d4ed8',
    actionRippleColor: 'rgba(29, 78, 216, 0.4)',
  },
};

export const PerActionHoverConfig = {
  render: (args) => <SearchWithState {...args} />,
  args: {
    logo: <Logo />,
    breadcrumbItems,
    actions: [
      { key: 'messages', icon: MessageCircle, tooltip: 'Hover deshabilitado en este botón', badge: 2, hover: false },
      { key: 'notifications', icon: Bell, tooltip: 'Hover verde con ola verde', badge: 3, hoverBgColor: '#dcfce7', hoverTextColor: '#15803d', rippleColor: 'rgba(21, 128, 61, 0.4)' },
      { key: 'help', icon: HelpCircle, tooltip: 'Hover violeta con ola violeta', hoverBgColor: '#f3e8ff', hoverTextColor: '#7e22ce', rippleColor: 'rgba(126, 34, 206, 0.4)' },
    ],
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
  },
};

// El buscador central abre un modal tipo "command palette" (Spotlight) al
// hacer click o al presionar Ctrl+K (Cmd+K en Mac) en cualquier parte de la
// página. Los resultados se agrupan por `category` y se filtran por texto.
export const WithCommandPalette = {
  args: {
    logo: <Logo />,
    breadcrumbItems,
    commandItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    userMenuItems,
  },
};

export const CommandPaletteCustomColors = {
  args: {
    logo: <Logo />,
    breadcrumbItems,
    commandItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    userMenuItems,
    paletteBgColor: '#ffffff',
    paletteTextColor: '#0f172a',
    paletteBorderColor: '#e2e8f0',
    paletteIconColor: '#64748b',
    paletteAccentColor: '#2563eb',
    paletteCategoryColor: '#94a3b8',
  },
};

// Simula resultados que tardan en llegar (ej. búsqueda remota): al abrir la
// paleta con Ctrl+K o con click, se ve el loading (spinner o skeleton) por
// un momento antes de mostrar los resultados reales.
const CommandPaletteLoadingDemo = (args) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TopBar
      {...args}
      commandPaletteLoading={isLoading}
      onCommandPaletteOpen={() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1200);
      }}
    />
  );
};

export const CommandPaletteLoadingSpinner = {
  render: (args) => <CommandPaletteLoadingDemo {...args} />,
  args: {
    logo: <Logo />,
    breadcrumbItems,
    commandItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    userMenuItems,
  },
};

export const CommandPaletteLoadingSkeleton = {
  render: (args) => <CommandPaletteLoadingDemo {...args} />,
  args: {
    logo: <Logo />,
    breadcrumbItems,
    commandItems,
    actions,
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    userMenuItems,
    commandPaletteLoadingType: 'skeleton',
    commandPaletteSkeletonCount: 5,
  },
};

// Navbar para landing pages públicas (no app logueada): `navLinks` reemplaza
// al buscador central, cada link puede tener `dropdownContent` para abrir un
// mega-menu que se desliza hacia abajo debajo de toda la barra, y `ctaButton`
// agrega un botón de acción a la derecha. `bgColor="transparent"` deja ver el
// fondo de la página detrás (útil sobre un hero con imagen/gradiente).
const megaMenuColumns = (
  <div style={{ display: 'flex', gap: 48, padding: '28px 48px', maxWidth: 960, margin: '0 auto' }}>
    <div>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Diseño</h4>
      <p style={{ margin: '0 0 8px 0', cursor: 'pointer' }}>UX/UI Design</p>
      <p style={{ margin: '0 0 8px 0', cursor: 'pointer' }}>Design Systems</p>
    </div>
    <div>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Desarrollo</h4>
      <p style={{ margin: '0 0 8px 0', cursor: 'pointer' }}>Frontend</p>
      <p style={{ margin: '0 0 8px 0', cursor: 'pointer' }}>Backend</p>
    </div>
  </div>
);

const navLinks = [
  { id: 'inicio', label: 'Inicio', href: '#' },
  { id: 'cursos', label: 'Cursos', dropdownContent: megaMenuColumns },
  { id: 'mentores', label: 'Mentores', href: '#' },
  { id: 'nosotros', label: 'Sobre nosotros', href: '#' },
  { id: 'contacto', label: 'Contacto', href: '#' },
];

export const PublicNavbar = {
  args: {
    logo: <Logo />,
    navLinks,
    ctaButton: {
      label: 'Regístrate ahora',
      onClick: () => console.log('cta click'),
      style: { borderRadius: '999px' },
    },
  },
};

export const PublicNavbarTransparentDark = {
  render: (args) => (
    <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '0 0 120px 0' }}>
      <TopBar {...args} />
    </div>
  ),
  args: {
    logo: <Logo />,
    navLinks,
    ctaButton: {
      label: 'Regístrate',
      onClick: () => console.log('cta click'),
      style: { borderRadius: '999px' },
    },
    bgColor: 'transparent',
    textColor: '#f8fafc',
    borderColor: 'transparent',
    navLinkColor: 'rgba(248, 250, 252, 0.75)',
    navLinkActiveColor: '#ffffff',
  },
};

const sidebarGroups = [
  {
    title: 'General',
    items: [
      { id: 'home', label: 'Inicio', icon: Home },
      { id: 'projects', label: 'Proyectos', icon: FolderKanban },
      { id: 'docs', label: 'Documentos', icon: FileText, badge: 'GET', badgeType: 'get' },
    ],
  },
];

// Layout real combinando TopBar + Sidebar: por debajo de 767px de viewport,
// el buscador central se reemplaza por un botón de lupa (abre el
// CommandPalette, porque esta demo usa `commandItems`), las `actions` se
// reemplazan por un botón "···" que las agrupa en un panel lateral, y
// aparece el botón hamburguesa (prop `onMenuClick`) a la izquierda del logo
// que abre el Sidebar como drawer deslizante (prop
// `isMobileOpen`/`onCloseMobile`, ver story `MobileDrawer` del Sidebar).
// Para ver el flujo completo, achicar la ventana del navegador por debajo de
// 767px — ambos componentes reaccionan al ancho real del viewport, no al
// tamaño de este contenedor de Storybook.
const LayoutWithMobileSidebarDemo = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');

  return (
    <div style={{ display: 'flex', height: 560, border: '1px solid #e2e8f0' }}>
      <ProSidebar
        groups={sidebarGroups}
        activeId={activeId}
        onSelect={(item) => setActiveId(item.id)}
        user={{ email: 'jane.doe@example.com' }}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar
          logo={<Logo />}
          title="Panel de administración"
          commandItems={commandItems}
          actions={actions}
          user={{ name: 'Jane Doe', email: 'jane.doe@example.com' }}
          userMenuItems={userMenuItems}
          onMenuClick={() => setIsMobileOpen(true)}
        />
        <div style={{ flex: 1, padding: 24, color: '#64748b', fontSize: '0.9rem' }}>
          Contenido de la página…
        </div>
      </div>
    </div>
  );
};

export const WithMobileSidebar = {
  render: () => <LayoutWithMobileSidebarDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Combina TopBar + Sidebar como lo haría un layout real. Achicar la ventana del navegador por debajo de 767px para ver el botón hamburguesa aparecer en el TopBar y abrir el Sidebar como drawer superpuesto.',
      },
    },
  },
};


