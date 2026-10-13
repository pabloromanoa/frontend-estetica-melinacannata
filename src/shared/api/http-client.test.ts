import { ApiError, getErrorMessage, GENERIC_ERROR_MESSAGE, isApiError } from './api-error';
import { buildUrl, createHttpClient } from './http-client';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('http-client', () => {
  const baseUrl = 'http://api.test/api/v1/';

  it('arma URLs ignorando params vacíos', () => {
    expect(buildUrl(baseUrl, '/catalog/services', { categoryId: 'c1', search: '', x: undefined, n: 0 })).toBe(
      'http://api.test/api/v1/catalog/services?categoryId=c1&n=0',
    );
    expect(buildUrl(baseUrl, 'auth/me')).toBe('http://api.test/api/v1/auth/me');
  });

  it('desenvuelve { data } y envía credentials: include', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ data: [{ id: '1' }] }));
    const client = createHttpClient({ baseUrl, fetchFn });
    await expect(client.get('/catalog/categories')).resolves.toEqual([{ id: '1' }]);
    const [, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(init.credentials).toBe('include');
    expect(init.method).toBe('GET');
  });

  it('devuelve data + meta', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(jsonResponse({ data: [], meta: { total: 3, pendingAmount: 18000 } }));
    const client = createHttpClient({ baseUrl, fetchFn });
    await expect(client.getWithMeta('/deposits')).resolves.toEqual({
      data: [],
      meta: { total: 3, pendingAmount: 18000 },
    });
  });

  it('meta vacía si el backend no la envía y cuerpo sin envelope', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ data: [] }))
      .mockResolvedValueOnce(jsonResponse([1, 2]));
    const client = createHttpClient({ baseUrl, fetchFn });
    await expect(client.getWithMeta('/x')).resolves.toEqual({ data: [], meta: {} });
    await expect(client.get('/y')).resolves.toEqual([1, 2]);
  });

  it('serializa JSON en POST/PUT', async () => {
    const fetchFn = vi.fn().mockImplementation(() => Promise.resolve(jsonResponse({ data: { ok: true } })));
    const client = createHttpClient({ baseUrl, fetchFn });
    await client.post('/auth/login', { email: 'a@b.c', password: '12345678' });
    await client.put('/staff/me/services', { serviceIds: [] });
    const [, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(init.body).toBe(JSON.stringify({ email: 'a@b.c', password: '12345678' }));
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    expect((fetchFn.mock.calls[1] as [string, RequestInit])[1].method).toBe('PUT');
  });

  it('envía FormData sin Content-Type (lo pone el navegador)', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ data: { id: 'a' } }));
    const client = createHttpClient({ baseUrl, fetchFn });
    const form = new FormData();
    form.append('file', new Blob(['%PDF'], { type: 'application/pdf' }), 'c.pdf');
    await client.post('/appointments/a/receipt', form);
    const [, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(init.body).toBe(form);
    expect((init.headers as Record<string, string>)['Content-Type']).toBeUndefined();
  });

  it('maneja 204 sin cuerpo', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const client = createHttpClient({ baseUrl, fetchFn });
    await expect(client.delete('/staff/me/exceptions/1')).resolves.toBeUndefined();
  });

  it('descarga blobs', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(new Response(new Blob(['%PDF-1.4'], { type: 'application/pdf' })));
    const client = createHttpClient({ baseUrl, fetchFn });
    const blob = await client.getBlob('/deposits/1/receipt');
    expect(blob.size).toBeGreaterThan(0);
  });

  it('mapea errores del contrato a ApiError', async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: 'SLOT_NOT_AVAILABLE',
            message: 'El horario ya no está disponible',
            details: { a: 1 },
          },
        },
        409,
      ),
    );
    const client = createHttpClient({ baseUrl, fetchFn });
    const error = await client.post('/appointments', {}).catch((e: unknown) => e);
    expect(isApiError(error)).toBe(true);
    expect(error).toMatchObject({
      code: 'SLOT_NOT_AVAILABLE',
      status: 409,
      message: 'El horario ya no está disponible',
      details: { a: 1 },
    });
    expect((error as ApiError).isClientError).toBe(true);
    expect(getErrorMessage(error)).toBe('El horario ya no está disponible');
  });

  it('usa un código genérico si la respuesta de error no respeta el formato', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('<html>', { status: 500 }));
    const client = createHttpClient({ baseUrl, fetchFn });
    const error = (await client.get('/x').catch((e: unknown) => e)) as ApiError;
    expect(error.code).toBe('HTTP_500');
    expect(error.message).toBe(GENERIC_ERROR_MESSAGE);
    expect(error.isClientError).toBe(false);
  });

  it('detecta 401 como sesión no iniciada', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(jsonResponse({ error: { code: 'UNAUTHENTICATED', message: 'Iniciá sesión' } }, 401));
    const client = createHttpClient({ baseUrl, fetchFn });
    const error = (await client.get('/auth/me').catch((e: unknown) => e)) as ApiError;
    expect(error.isUnauthenticated).toBe(true);
  });

  it('convierte fallas de red en NETWORK_ERROR y respeta abortos', async () => {
    const client = createHttpClient({
      baseUrl,
      fetchFn: vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    });
    await expect(client.get('/x')).rejects.toMatchObject({ code: 'NETWORK_ERROR', status: 0 });

    const abort = new DOMException('aborted', 'AbortError');
    const aborting = createHttpClient({ baseUrl, fetchFn: vi.fn().mockRejectedValue(abort) });
    await expect(aborting.get('/x')).rejects.toBe(abort);
  });

  it('getErrorMessage tiene un mensaje genérico para errores desconocidos', () => {
    expect(getErrorMessage(new Error('boom'))).toBe(GENERIC_ERROR_MESSAGE);
    expect(getErrorMessage(new ApiError({ code: 'X', message: '', status: 400 }))).toBe(
      GENERIC_ERROR_MESSAGE,
    );
  });
});
