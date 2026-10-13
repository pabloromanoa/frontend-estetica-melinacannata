import { makeService } from '@/test/fixtures';
import { recommendationBookingHref, repeatBookingHref } from './booking-links';

describe('booking-links', () => {
  it('arma el link para repetir un turno', () => {
    expect(repeatBookingHref({ service: { id: 's1' }, provider: { id: 'p 1' } })).toBe(
      '/reservar?serviceId=s1&providerId=p+1',
    );
  });

  it('arma el link de reserva para una recomendación', () => {
    const treatment = {
      id: 't1',
      name: 'Plan',
      description: null,
      isActive: true,
      recommendationTags: [],
      services: [],
    };
    expect(
      recommendationBookingHref({ id: 'r1', type: 'SERVICE', service: makeService(), treatment: null }),
    ).toBe('/reservar?recommendationId=r1&serviceId=svc-1');
    expect(recommendationBookingHref({ id: 'r1', type: 'TREATMENT', service: null, treatment })).toBe(
      '/reservar?recommendationId=r1&treatmentId=t1&step=0',
    );
    expect(recommendationBookingHref({ id: 'r1', type: 'SERVICE', service: null, treatment: null })).toBe(
      '/reservar?recommendationId=r1',
    );
  });
});
