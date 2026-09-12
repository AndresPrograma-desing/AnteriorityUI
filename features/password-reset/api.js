import { request } from '../../common/api/client';

export async function requestPasswordReset(email) {
  return request('/users/request-password-reset', {
    method: 'POST',
    body: { email: String(email).trim() },
  });
}

export async function getResetStatus(email) {
  return request(`/users/reset-status/${encodeURIComponent(email)}`, {
    method: 'GET',
  });
}

export async function getPendingResets() {
  return request('/users/pending-resets', {
    method: 'GET',
  });
}

export async function assignNewPassword(email, new_password) {
  return request('/users/assign-new-password', {
    method: 'POST',
    body: {
      email: String(email).trim(),
      new_password: String(new_password).trim(),
    },
  });
}

const api = {
  requestPasswordReset,
  getResetStatus,
  getPendingResets,
  assignNewPassword,
};

export default api;
