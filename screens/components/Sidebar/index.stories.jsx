import { useState } from 'react';
import { Activity, ClipboardList, Home, FileText, Settings, Users, LogOut, User } from 'lucide-react';
import ProSidebar from './index';

export default {
  title: 'Components/Sidebar',
  component: ProSidebar,
};

const groups = [
  {
    title: 'General',
    items: [
      { id: 'home', label: 'Inicio', icon: Home },
      { id: 'docs', label: 'Documentos', icon: FileText, badge: 'GET', badgeType: 'get' },
      { id: 'team', label: 'Equipo', icon: Users, isOwner: true, isShared: true },
    ],
  },
  {
    title: 'Configuración',
    items: [
      { id: 'settings', label: 'Ajustes', icon: Settings, pinned: true },
    ],
  },
];

const userMenuItems = [
  { id: 'profile', label: 'Mi perfil', icon: User, onClick: () => console.log('profile clicked') },
  { id: 'logout', label: 'Cerrar sesión', icon: LogOut, variant: 'danger', onClick: () => console.log('logout clicked') },
];

const userMenuLinks = [
  { id: 'privacy', label: 'Política de Privacidad', link: 'https://example.com/privacidad' },
  { id: 'terms', label: 'Términos del Servicio', link: 'https://example.com/terminos' },
];

const userFooterAction = {
  icon: Settings,
  tooltip: 'Configuración',
  onClick: () => console.log('settings clicked'),
};

const SidebarWithState = (args) => {
  const [activeId, setActiveId] = useState(args.activeId ?? groups[0].items[0].id);
  return (
    <div style={{ height: 600 }}>
      <ProSidebar
        {...args}
        activeId={activeId}
        onSelect={(item) => setActiveId(item.id)}
      />
    </div>
  );
};

export const Default = {
  render: (args) => <SidebarWithState {...args} />,
  args: {
    groups,
    user: { email: 'jane.doe@example.com' },
    userMenuItems,
    userMenuLinks,
    userFooterAction,
  },
};

export const WithItemActions = {
  render: (args) => <SidebarWithState {...args} />,
  args: {
    groups,
    user: { email: 'jane.doe@example.com' },
    userMenuItems,
    onItemEdit: (item) => console.log('edit', item),
    onItemDelete: (item) => console.log('delete', item),
    onItemPin: (item) => console.log('pin', item),
    onItemCollaborators: (item) => console.log('collaborators', item),
    onReorderItems: (orderedIds) => console.log('reordered', orderedIds),
  },
};

export const Loading = {
  render: (args) => <SidebarWithState {...args} />,
  args: {
    groups: [],
    loading: true,
    skeletonItems: 8,
    user: { email: 'jane.doe@example.com' },
  },
};

export const NotCollapsible = {
  render: (args) => <SidebarWithState {...args} />,
  args: {
    groups,
    collapsible: false,
    user: { email: 'jane.doe@example.com' },
    userMenuItems,
  },
};

const groupsWithSubItems = [
  {
    title: 'General',
    items: [
      { id: 'home', label: 'Inicio', icon: Home },
      {
        id: 'vaccines',
        label: 'Vacunas',
        icon: Activity,
        subItems: [
          { id: 'vaccines-view', label: 'Ver vacunas' },
          { id: 'vaccines-create', label: 'Crear vacuna' },
          { id: 'vaccines-pending', label: 'Vacunas pendientes' },
          { id: 'vaccines-batches', label: 'Lotes de vacunas' },
        ],
      },
      { id: 'prescriptions', label: 'Gestión de Recetas', icon: ClipboardList },
    ],
  },
];

export const WithSubItems = {
  render: (args) => <SidebarWithState {...args} />,
  args: {
    groups: groupsWithSubItems,
    activeId: 'vaccines-view',
    user: { email: 'jane.doe@example.com' },
    userMenuItems,
  },
};

const MobileDrawerDemo = (args) => {
  const [activeId, setActiveId] = useState(groups[0].items[0].id);
  const [isMobileOpen, setIsMobileOpen] = useState(true);
  return (
    <div style={{ height: 600 }}>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
      >
        Abrir menú
      </button>
      <ProSidebar
        {...args}
        activeId={activeId}
        onSelect={(item) => setActiveId(item.id)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
    </div>
  );
};

export const MobileDrawer = {
  render: (args) => <MobileDrawerDemo {...args} />,
  args: {
    groups,
    user: { email: 'jane.doe@example.com' },
    userMenuItems,
    userMenuLinks,
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlado desde el consumidor vía `isMobileOpen`/`onCloseMobile` (ver botón "Abrir menú" arriba). El drawer deslizante con backdrop y botón de cerrar solo aplica por debajo de 767px de viewport — en pantallas más anchas estas props no tienen efecto visual y el Sidebar se ve igual que `Default`; achicar la ventana del navegador para ver el comportamiento real.',
      },
    },
  },
};
