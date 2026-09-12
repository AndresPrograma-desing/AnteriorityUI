import ModalTooltip from './ModalTooltip';

export default {
  title: 'Components/ModalTooltip',
  component: ModalTooltip,
};

export const Top = {
  args: {
    text: 'Tooltip on top',
    position: 'top',
    children: <button type="button">Hover me</button>,
  },
};

export const Bottom = {
  args: {
    text: 'Tooltip on bottom',
    position: 'bottom',
    children: <button type="button">Hover me</button>,
  },
};

export const WithDelay = {
  args: {
    text: 'Shows after a longer delay',
    position: 'top',
    delay: 600,
    children: <button type="button">Slow tooltip</button>,
  },
};

export const OnText = {
  args: {
    text: 'More information about this label',
    position: 'right',
    children: <span style={{ textDecoration: 'underline dotted' }}>Hover this text</span>,
  },
};
