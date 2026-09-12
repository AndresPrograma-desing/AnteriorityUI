import { useState } from 'react';
import { Settings, Users, FileText } from 'lucide-react';
import SubSidebarLayout from './index';

export default {
  title: 'Components/SubSidebarLayout',
  component: SubSidebarLayout,
};

const menuItems = [
  { id: 'general', label: 'General', icon: <Settings size={16} /> },
  { id: 'users', label: 'Usuarios', icon: <Users size={16} /> },
  { id: 'docs', label: 'Documentos', icon: <FileText size={16} /> },
];

const LayoutWithState = (args) => {
  const [activeItemId, setActiveItemId] = useState(args.activeItemId ?? menuItems[0].id);
  return (
    <div style={{ height: 400 }}>
      <SubSidebarLayout
        {...args}
        activeItemId={activeItemId}
        onItemClick={(id) => setActiveItemId(id)}
      />
    </div>
  );
};

export const Default = {
  render: (args) => <LayoutWithState {...args} />,
  args: {
    menuItems,
    children: <div style={{ padding: 24 }}>Selected section content goes here.</div>,
  },
};

export const NoIcons = {
  render: (args) => <LayoutWithState {...args} />,
  args: {
    menuItems: menuItems.map(({ id, label }) => ({ id, label })),
    children: <div style={{ padding: 24 }}>Content without icons in the menu.</div>,
  },
};

export const EmptyContent = {
  render: (args) => <LayoutWithState {...args} />,
  args: {
    menuItems,
    children: null,
  },
};
