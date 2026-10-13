import { arrayToTable, humanizeKey, normalizeReport } from './report-table';

describe('report-table', () => {
  it('humaniza claves', () => {
    expect(humanizeKey('pendingAmount')).toBe('Pending amount');
    expect(humanizeKey('agenda-efficiency')).toBe('Agenda efficiency');
    expect(humanizeKey('total_value')).toBe('Total value');
  });

  it('convierte un array de objetos en tabla aplanando un nivel', () => {
    const table = arrayToTable('Servicios', [
      { name: 'Masaje', count: 3, provider: { displayName: 'Camila', id: 'p1' } },
      { name: 'Facial', count: 1, extra: true, tags: ['a', 'b'] },
    ]);
    expect(table.columns).toEqual(['Name', 'Count', 'Provider.display name', 'Provider.id', 'Extra', 'Tags']);
    expect(table.rows[0]?.cells).toEqual(['Masaje', 3, 'Camila', 'p1', null, null]);
    expect(table.rows[1]?.cells).toEqual(['Facial', 1, null, null, true, 'a, b']);
  });

  it('normaliza objetos con escalares, anidados y arrays', () => {
    const report = normalizeReport({
      from: '2026-10-01',
      totals: { count: 4, value: 1000 },
      rows: [{ id: 1, nested: { a: { deep: 1 }, name: 'Profundo' } }],
    });
    expect(report.summary).toEqual([
      { label: 'From', value: '2026-10-01' },
      { label: 'Totals · Count', value: 4 },
      { label: 'Totals · Value', value: 1000 },
    ]);
    expect(report.tables[0]?.title).toBe('Rows');
    expect(report.tables[0]?.rows[0]?.cells).toEqual([1, 'Profundo']);
  });

  it('acepta arrays en la raíz, escalares y valores primitivos en arrays', () => {
    expect(normalizeReport([{ a: 1 }]).tables[0]?.rows).toEqual([{ key: '[1]#1', cells: [1] }]);
    expect(normalizeReport(42).summary).toEqual([{ label: 'Resultados', value: 42 }]);
    expect(arrayToTable('x', [1, 1]).rows.map((r) => r.key)).toEqual(['[1]#1', '[1]#2']);
    expect(arrayToTable('x', [{ o: { a: { b: 1 } } }]).rows[0]?.cells[0]).toBe('{"a":{"b":1}}');
  });
});
