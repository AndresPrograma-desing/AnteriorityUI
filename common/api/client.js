let baseURL = '';
let getAuthToken = () => null;

// Debe llamarse una vez al iniciar la app consumidora de la librería.
export function configureApiClient({ baseURL: base, getAuthToken: tokenGetter } = {}) {
  if (base !== undefined) baseURL = base;
  if (tokenGetter) getAuthToken = tokenGetter;
}

export async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseURL}${cleanPath}`;

  const opts = { method, headers: { ...headers } };

  if (auth) {
    const token = getAuthToken();
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body !== undefined && !['GET', 'HEAD'].includes(method.toUpperCase())) {
    opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const res = await fetch(url, opts);

  if (res.status === 204) return null;

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    const err = new Error((data && (data.error || data.message)) || res.statusText || `Request failed (${res.status})`);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}
