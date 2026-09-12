import { request } from '../../common/api/client';

export async function updateUserName(payload) {
  return request('/Users/update-user-name', { method: 'PATCH', body: payload });
}
