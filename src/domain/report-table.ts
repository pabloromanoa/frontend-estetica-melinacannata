/**
 * El contrato define que `/admin/reports/:type` devuelve JSON sin un esquema fijo.
 * Estas funciones lo normalizan a "resumen clave/valor" + "tablas" para poder renderizarlo genéricamente.
 */
export type CellValue = string | number | boolean | null;

export interface ReportRow {
  /** Clave estable derivada del contenido (sin usar el índice). */
  key: string;
  cells: CellValue[];
}

export interface ReportTable {
  title: string;
  columns: string[];
  rows: ReportRow[];
}

/** Claves por contenido; si dos filas son idénticas se diferencian por ocurrencia. */
function withContentKeys(rows: CellValue[][]): ReportRow[] {
  const seen = new Map<string, number>();
  return rows.map((cells) => {
    const base = JSON.stringify(cells);
    const occurrence = (seen.get(base) ?? 0) + 1;
    seen.set(base, occurrence);
    return { key: `${base}#${occurrence}`, cells };
  });
}

export interface NormalizedReport {
  summary: Array<{ label: string; value: CellValue }>;
  tables: ReportTable[];
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** "pendingAmount" → "Pending amount", "agenda-efficiency" → "Agenda efficiency". */
export function humanizeKey(key: string): string {
  const spaced = key
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function toCell(value: unknown): CellValue {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map((item) => toCell(item)).join(', ');
  if (isPlainObject(value)) {
    const label = value.name ?? value.displayName ?? value.label ?? value.id;
    return typeof label === 'string' ? label : JSON.stringify(value);
  }
  return String(value);
}

/** Aplana un objeto de 1 nivel: `{ a: { b: 1 } }` → `{ 'a.b': 1 }`. */
function flattenRow(row: Record<string, unknown>): Record<string, CellValue> {
  const flat: Record<string, CellValue> = {};
  for (const [key, value] of Object.entries(row)) {
    if (isPlainObject(value) && Object.values(value).every((v) => !isPlainObject(v) && !Array.isArray(v))) {
      for (const [inner, innerValue] of Object.entries(value)) flat[`${key}.${inner}`] = toCell(innerValue);
    } else {
      flat[key] = toCell(value);
    }
  }
  return flat;
}

export function arrayToTable(title: string, items: readonly unknown[]): ReportTable {
  const objects = items.map((item) => (isPlainObject(item) ? flattenRow(item) : { valor: toCell(item) }));
  const columns = [...new Set(objects.flatMap((row) => Object.keys(row)))];
  return {
    title,
    columns: columns.map(humanizeKey),
    rows: withContentKeys(objects.map((row) => columns.map((column) => row[column] ?? null))),
  };
}

export function normalizeReport(data: unknown, rootTitle = 'Resultados'): NormalizedReport {
  if (Array.isArray(data)) return { summary: [], tables: [arrayToTable(rootTitle, data)] };
  if (!isPlainObject(data)) return { summary: [{ label: rootTitle, value: toCell(data) }], tables: [] };

  const report: NormalizedReport = { summary: [], tables: [] };
  const visit = (object: Record<string, unknown>, prefix: string): void => {
    for (const [key, value] of Object.entries(object)) {
      const label = prefix ? `${prefix} · ${humanizeKey(key)}` : humanizeKey(key);
      if (Array.isArray(value)) report.tables.push(arrayToTable(label, value));
      else if (isPlainObject(value)) visit(value, label);
      else report.summary.push({ label, value: toCell(value) });
    }
  };
  visit(data, '');
  return report;
}
