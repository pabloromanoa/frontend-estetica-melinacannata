/** Error normalizado de la API: `{ error: { code, message, details? } }` del contrato. */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details: unknown;

  constructor(params: { code: string; message: string; status: number; details?: unknown }) {
    super(params.message);
    this.name = 'ApiError';
    this.code = params.code;
    this.status = params.status;
    this.details = params.details;
  }

  get isUnauthenticated(): boolean {
    return this.status === HTTP_UNAUTHORIZED || this.code === 'UNAUTHENTICATED';
  }

  get isClientError(): boolean {
    return this.status >= HTTP_BAD_REQUEST && this.status < HTTP_SERVER_ERROR;
  }
}

const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_SERVER_ERROR = 500;

export const GENERIC_ERROR_MESSAGE = 'Ocurrió un error inesperado. Probá de nuevo en unos minutos.';
export const NETWORK_ERROR_MESSAGE = 'No pudimos conectarnos con el servidor. Revisá tu conexión.';

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Mensaje apto para mostrar al usuario a partir de cualquier error. */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message || GENERIC_ERROR_MESSAGE;
  return GENERIC_ERROR_MESSAGE;
}
