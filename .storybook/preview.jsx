import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from '../common/theme/muiTheme';
import '../common/styles/variables.css';
import '../common/styles/typography.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={muiTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;