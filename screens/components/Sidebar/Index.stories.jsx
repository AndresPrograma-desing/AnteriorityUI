import { useState } from 'react';
import { Home, FileText, Settings, Users, LogOut, User } from 'lucide-react';
import ProSidebar from './Index';

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
