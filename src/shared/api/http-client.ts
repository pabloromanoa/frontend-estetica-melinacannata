import { env } from '@/config/env';
import { ApiError, GENERIC_ERROR_MESSAGE, NETWORK_ERROR_MESSAGE } from './api-error';

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
  query?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
}

export interface Envelope<T, M = Record<string, unknown>> {
  data: T;
  meta?: M;
}

export interface HttpClient {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  getWithMeta<T, M>(path: string, options?: RequestOptions): Promise<{ data: T; meta: M }>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T = void>(path: string, options?: RequestOptions): Promise<T>;
  getBlob(path: string, options?: RequestOptions): Promise<Blob>;
}

interface HttpClientConfig {
  baseUrl: string;
  fetchFn?: typeof fetch;
}

const HTTP_NO_CONTENT = 204;

export function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  const url = `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.append(key, String(value));
  });
  const search = params.toString();
  return search ? `${url}?${search}` : url;
}

const isEnvelope = (value: unknown): value is Envelope<unknown> =>
  typeof value === 'object' && value !== null && 'data' in value;

async function parseJsonSafely(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = await parseJsonSafely(response);
  const error =
    typeof body === 'object' && body !== null && 'error' in body
      ? (body as { error: { code?: string; message?: string; details?: unknown } }).error
      : undefined;
  return new ApiError({
    code: error?.code ?? `HTTP_${response.status}`,
    message: error?.message ?? GENERIC_ERROR_MESSAGE,
    status: response.status,
    details: error?.details,
  });
}

/**
 * Cliente HTTP sobre fetch:
 *  - base URL + query params
 *  - `credentials: 'include'` (la sesión es una cookie HttpOnly)
 *  - serializa JSON o envía FormData tal cual
 *  - desenvuelve `{ data }` / `{ data, meta }` y convierte errores en `ApiError`
 */
export function createHttpClient({ baseUrl, fetchFn }: HttpClientConfig): HttpClient {
  const doFetch = fetchFn ?? ((...args: Parameters<typeof fetch>) => fetch(...args));

  async function send(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<Response> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    let body: BodyInit | undefined;
    if (options.body instanceof FormData) {
      body = options.body;
    } else if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.body);
    }
    let response: Response;
    try {
      response = await doFetch(buildUrl(baseUrl, path, options.query), {
        method,
        headers,
        body,
        credentials: 'include',
        signal: options.signal,
      });
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
      throw new ApiError({
        code: 'NETWORK_ERROR',
        message: NETWORK_ERROR_MESSAGE,
        status: 0,
        details: cause,
      });
    }
    if (!response.ok) throw await toApiError(response);
    return response;
  }

  async function json<T>(method: HttpMethod, path: string, options?: RequestOptions): Promise<Envelope<T>> {
    const response = await send(method, path, options);
    if (response.status === HTTP_NO_CONTENT) return { data: undefined as T };
    const body = await parseJsonSafely(response);
    return isEnvelope(body) ? (body as Envelope<T>) : { data: body as T };
  }

  return {
    get: async <T>(path: string, options?: RequestOptions) => (await json<T>('GET', path, options)).data,
    getWithMeta: async <T, M>(path: string, options?: RequestOptions) => {
      const envelope = await json<T>('GET', path, options);
      return { data: envelope.data, meta: (envelope.meta ?? {}) as M };
    },
    post: async <T>(path: string, body?: unknown, options?: RequestOptions) =>
      (await json<T>('POST', path, { ...options, body })).data,
    put: async <T>(path: string, body?: unknown, options?: RequestOptions) =>
      (await json<T>('PUT', path, { ...options, body })).data,
    delete: async <T = void>(path: string, options?: RequestOptions) =>
      (await json<T>('DELETE', path, options)).data,
    getBlob: async (path: string, options?: RequestOptions) => (await send('GET', path, options)).blob(),
  };
}

/** Instancia por defecto apuntando a `VITE_API_URL`. */
export const httpClient = createHttpClient({ baseUrl: env.VITE_API_URL });
