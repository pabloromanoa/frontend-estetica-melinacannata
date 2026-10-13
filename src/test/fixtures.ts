import type { Appointment, AvailableSlot, Deposit, ProviderSummary, Service } from '@/domain';

/** Fábricas de datos para tests (no se usan en la app). */
export const providerFixture: ProviderSummary = {
  id: 'prov-1',
  displayName: 'Camila Vega',
  specialty: 'Especialista en Uñas',
  avatarUrl: null,
};

export function makeDeposit(overrides: Partial<Deposit> = {}): Deposit {
  return {
    id: 'dep-1',
    appointmentId: 'appt-1',
    amount: 7000,
    status: 'PENDING',
    uploadedAt: '2026-10-24T17:22:00.000Z',
    reviewedAt: null,
    rejectionReason: null,
    ...overrides,
  };
}

export function makeAppointment(overrides: Partial<Appointment> = {}): Appointment {
  return {
    id: 'appt-1',
    code: 'TRN-8841',
    status: 'CREATED',
    startAt: '2026-10-25T17:30:00.000Z',
    endAt: '2026-10-25T19:00:00.000Z',
    holdExpiresAt: '2026-10-24T17:17:00.000Z',
    price: 22000,
    depositAmount: 11000,
    remainingAmount: 11000,
    service: { id: 'svc-1', name: 'Manicuría Rusa', durationMinutes: 90 },
    provider: {
      ...providerFixture,
      bankDetails: {
        alias: 'CAMILA.VEGA.NAILS',
        cbu: '0000003100049281749201',
        holder: 'Camila Belén Vega',
        cuil: '27-38491024-4',
        bankName: 'Banco Galicia',
      },
    },
    client: {
      id: 'cli-1',
      firstName: 'Florencia',
      lastName: 'Benítez',
      dni: '30111222',
      phone: '+54 9 11 4829-1102',
      email: null,
      hasAccount: false,
    },
    deposit: null,
    rescheduled: false,
    rescheduleReason: null,
    cancellationReason: null,
    cancelledBy: null,
    depositOutcome: null,
    createdAt: '2026-10-24T17:12:00.000Z',
    ...overrides,
  };
}

export function makeSlot(overrides: Partial<AvailableSlot> = {}): AvailableSlot {
  return {
    startAt: '2026-10-25T17:30:00.000Z',
    endAt: '2026-10-25T19:00:00.000Z',
    providers: [providerFixture],
    contiguous: false,
    ...overrides,
  };
}

export function makeService(overrides: Partial<Service> = {}): Service {
  return {
    id: 'svc-1',
    name: 'Manicuría Rusa',
    description: 'Cuidado integral de cutículas',
    imageUrl: null,
    durationMinutes: 90,
    price: 22000,
    depositAmount: 11000,
    prepMinutes: 0,
    cleanupMinutes: 10,
    isActive: true,
    recommendationTags: [],
    specificDates: [],
    categories: [{ id: 'cat-1', name: 'Uñas', isActive: true }],
    providers: [providerFixture],
    ...overrides,
  };
}
