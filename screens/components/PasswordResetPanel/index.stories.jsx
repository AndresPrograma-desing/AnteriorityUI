import React from 'react';
import PasswordResetPanel from './index';

export default {
  title: 'Components/PasswordResetPanel',
  component: PasswordResetPanel,
};

// Note: this component calls a real hook (useAdminPasswordReset) which performs
// fetch() calls to relative API paths (e.g. /users/pending-resets). There is no
// backend in Storybook, so those requests will fail/reject — this is expected,
// and the panel still renders its initial/loading/error UI without crashing.

export const Open = {
  args: {
    isOpen: true,
    onClose: () => console.log('close panel'),
  },
};

export const Closed = {
  args: {
    isOpen: false,
    onClose: () => console.log('close panel'),
  },
};
