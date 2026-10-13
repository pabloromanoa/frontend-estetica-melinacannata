/** Reglas de negocio y parámetros de UI centralizados (sin números mágicos en el código). */

/** Minutos que dura la reserva temporal (estado CREATED) antes de liberarse. */
export const HOLD_MINUTES = 5;

/** Horas de anticipación mínimas para que la cancelación devuelva la seña. */
export const CANCELLATION_REFUND_HOURS = 24;

/** Tamaño máximo del comprobante en MB. */
export const MAX_RECEIPT_MB = 5;
export const BYTES_PER_MB = 1024 * 1024;
export const RECEIPT_MIME_TYPE = 'application/pdf';

/** Proporción del precio que se cobra como seña. */
export const DEPOSIT_RATE = 0.5;

export const BUSINESS_TIMEZONE = 'America/Argentina/Buenos_Aires';
export const BUSINESS_LOCALE = 'es-AR';
export const BUSINESS_NAME = 'Melina Cannata';
export const BUSINESS_TAGLINE = 'Salud & Estética Integral';
/** Código de país + prefijo móvil para armar links de WhatsApp de números argentinos. */
export const WHATSAPP_COUNTRY_PREFIX = '549';
export const WHATSAPP_BASE_URL = 'https://wa.me';

/** Tamaño del bloque de la grilla de agenda y de la matriz de disponibilidad. */
export const SLOT_GRID_MINUTES = 30;
/** Rango horario que muestra la matriz de disponibilidad semanal. */
export const AVAILABILITY_GRID_START = '07:00';
export const AVAILABILITY_GRID_END = '22:00';
/** Presets "Mañanas" / "Tardes" de la matriz de disponibilidad. */
export const MORNING_PRESET = { start: '08:00', end: '13:00' } as const;
export const AFTERNOON_PRESET = { start: '14:00', end: '21:00' } as const;
/** Rango por defecto de la agenda diaria cuando nadie tiene horario cargado. */
export const AGENDA_DEFAULT_START = '08:00';
export const AGENDA_DEFAULT_END = '20:00';

/** Cantidad de señas que se muestran en el panel lateral "Validar Señas". */
export const DEPOSITS_PREVIEW_COUNT = 3;
/** Sugerencias de horarios en "Nueva Reserva". */
export const SUGGESTED_SLOTS_DAYS = 7;
export const SUGGESTED_SLOTS_LIMIT = 6;
/** Rango por defecto (días) del buscador de turnos en "Seguimiento". */
export const TRACKING_SEARCH_PAST_DAYS = 30;
export const TRACKING_SEARCH_FUTURE_DAYS = 60;
/** Ventana de excepciones de disponibilidad que se listan (días hacia adelante). */
export const EXCEPTIONS_LOOKAHEAD_DAYS = 120;

/** Intervalos de UI (ms). */
export const COUNTDOWN_TICK_MS = 1000;
export const CLOCK_TICK_MS = 60_000;
export const COPY_FEEDBACK_MS = 2000;
export const SEARCH_DEBOUNCE_MS = 350;
export const DEFAULT_STALE_TIME_MS = 30_000;
export const DEPOSITS_REFETCH_INTERVAL_MS = 60_000;

export const MIN_PASSWORD_LENGTH = 8;

/** Alto (px) de cada fila de 30 min en la Agenda Diaria. */
export const AGENDA_ROW_HEIGHT_PX = 56;
/** Ancho mínimo (px) de la columna de cada prestador en la Agenda Diaria. */
export const AGENDA_COLUMN_MIN_WIDTH_PX = 190;
