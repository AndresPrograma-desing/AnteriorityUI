import React, { useState } from 'react';
import { Bell, MessageCircle, HelpCircle, LogOut, User, Settings } from 'lucide-react';
import { SiPubg } from 'react-icons/si';
import TopBar from './index.jsx';

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
];

const actions = [
  { key: 'messages', icon: MessageCircle, tooltip: 'Mensajes', badge: 2, onClick: () => console.log('messages') },
  { key: 'notifications', icon: Bell, tooltip: 'Notificaciones', badge: 3, onClick: () => console.log('notifications') },
  { key: 'help', icon: HelpCircle, tooltip: 'Ayuda', onClick: () => console.log('help') },
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

// Por debajo de 1024px el buscador se achica, por debajo de 768px se oculta
// (el consumidor puede ofrecer una lupa en `actions` para ese breakpoint), y
// el breadcrumb/título truncan con max-width en vez de desbordar. Reducí el
// ancho del viewport de este preview en Storybook para ver la transición.
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

