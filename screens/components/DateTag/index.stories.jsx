import DateTag from './index.jsx';

export default {
  title: 'Components/DateTag',
  component: DateTag,
};

export const Default = {
  args: {
    date: '2026-09-12T10:30:00',
  },
};

export const CustomColors = {
  args: {
    date: '2026-01-05T08:00:00',
    bgColor: '#fee2e2',
    textColor: '#b91c1c',
  },
};

export const CustomIconColor = {
  args: {
    date: '2026-12-25T00:00:00',
    bgColor: '#dcfce7',
    textColor: '#166534',
    iconColor: '#16a34a',
  },
};
