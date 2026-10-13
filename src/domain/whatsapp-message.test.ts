import { buildBookingMessage, buildWhatsAppUrl, normalizeArgentinePhone } from './whatsapp-message';

describe('whatsapp-message', () => {
  const bank = {
    alias: 'CAMILA.VEGA.NAILS',
    cbu: '0000003100049281749201',
    holder: 'Camila Belén Vega',
    cuil: null,
    bankName: null,
  };

  it('arma el mensaje con alias, seña y fecha en la zona del negocio', () => {
    const message = buildBookingMessage({
      clientFirstName: 'Florencia',
      serviceName: 'Manicuría Rusa',
      startAt: '2026-10-25T17:30:00.000Z',
      depositAmount: 7000,
      bankDetails: bank,
      providerName: 'Camila Vega',
    });
    expect(message).toContain(
      '¡Hola Florencia! Tu turno para Manicuría Rusa quedó agendado el Domingo 25 de Octubre • 14:30 hs con Camila Vega.',
    );
    expect(message).toContain('seña de $7.000 al alias CAMILA.VEGA.NAILS');
    expect(message).toContain('Titular: Camila Belén Vega.');
    expect(message).toContain('envianos el comprobante');
  });

  it('usa CBU si no hay alias e incluye el enlace privado', () => {
    const message = buildBookingMessage({
      clientFirstName: 'Ana',
      serviceName: 'Masaje',
      startAt: '2026-10-25T17:30:00.000Z',
      depositAmount: 5000,
      bankDetails: { ...bank, alias: null, holder: null },
      privateLink: 'https://app.test/turno/abc',
    });
    expect(message).toContain('al CBU 0000003100049281749201');
    expect(message).toContain('https://app.test/turno/abc');
    expect(message).not.toContain('Titular');
  });

  it('sin datos bancarios usa un texto genérico', () => {
    const message = buildBookingMessage({
      clientFirstName: 'Ana',
      serviceName: 'Masaje',
      startAt: '2026-10-25T17:30:00.000Z',
      depositAmount: 5000,
      bankDetails: null,
    });
    expect(message).toContain('a la cuenta que te indicamos');
  });

  it('normaliza teléfonos argentinos', () => {
    expect(normalizeArgentinePhone('+54 9 11 4829-1102')).toBe('5491148291102');
    expect(normalizeArgentinePhone('+54 11 4829-1102')).toBe('5491148291102');
    expect(normalizeArgentinePhone('11 4829 1102')).toBe('5491148291102');
    expect(normalizeArgentinePhone('011 15 4829-1102')).toBe('5491148291102');
    expect(normalizeArgentinePhone('0381 15 512-3456')).toBe('5493815123456');
    expect(normalizeArgentinePhone('---')).toBe('');
  });

  it('arma el link wa.me con el texto encodeado', () => {
    expect(buildWhatsAppUrl('11 4829 1102', 'Hola & chau')).toBe(
      'https://wa.me/5491148291102?text=Hola%20%26%20chau',
    );
    expect(buildWhatsAppUrl(null, 'Hola')).toBe('https://wa.me/?text=Hola');
  });
});
