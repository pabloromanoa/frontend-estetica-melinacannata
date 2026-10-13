/**
 * Tipos del contrato de API v1 (docs/api-contract.md).
 * Este archivo es la única traducción del contrato a TypeScript: si el contrato cambia, se cambia acá.
 */

export type Role = 'CLIENT' | 'PROVIDER' | 'ADMIN';

export type AppointmentStatus =
  'CREATED' | 'PAYMENT_INFORMED' | 'DEPOSIT_PAID' | 'FINISHED' | 'CANCELLED' | 'EXPIRED';
export type DepositStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type DepositOutcome = 'REFUND' | 'FORFEIT' | 'NOT_APPLICABLE';
export type CancelledBy = 'CLIENT' | 'PROVIDER' | 'ADMIN';

export type IsoDateTime = string;
/** `YYYY-MM-DD` en la zona del negocio. */
export type DateKey = string;
/** `HH:mm` (24h) en la zona del negocio. */
export type TimeOfDay = string;

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  providerId: string | null;
  clientId: string | null;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

export interface ProviderSummary {
  id: string;
  displayName: string;
  specialty: string | null;
  avatarUrl: string | null;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  durationMinutes: number;
  price: number;
  /** 50% del precio. */
  depositAmount: number;
  prepMinutes: number;
  cleanupMinutes: number;
  isActive: boolean;
  recommendationTags: string[];
  /** `[]` = se presta habitualmente. */
  specificDates: DateKey[];
  categories: Category[];
  providers: ProviderSummary[];
}

export interface Treatment {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  recommendationTags: string[];
  /** Ordenados. */
  services: Service[];
}

export interface BankDetails {
  alias: string | null;
  cbu: string | null;
  holder: string | null;
  cuil: string | null;
  bankName: string | null;
}

export interface Provider extends ProviderSummary {
  userId: string;
  email: string;
  isActive: boolean;
  bio: string | null;
  bankDetails: BankDetails;
  serviceIds: string[];
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WeeklyAvailabilityRange {
  /** 0 = domingo. */
  dayOfWeek: DayOfWeek;
  startTime: TimeOfDay;
  endTime: TimeOfDay;
}

export type AvailabilityExceptionType = 'UNAVAILABLE' | 'AVAILABLE';

export interface AvailabilityException {
  id: string;
  date: DateKey;
  type: AvailabilityExceptionType;
  /** `null + null` en UNAVAILABLE = todo el día. */
  startTime: TimeOfDay | null;
  endTime: TimeOfDay | null;
  reason: string | null;
}

export type NewAvailabilityException = Omit<AvailabilityException, 'id'>;

export interface ClientSummary {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string | null;
  hasAccount: boolean;
}

export interface Deposit {
  id: string;
  appointmentId: string;
  amount: number;
  status: DepositStatus;
  uploadedAt: IsoDateTime;
  reviewedAt: IsoDateTime | null;
  rejectionReason: string | null;
}

export interface Appointment {
  id: string;
  /** Ej. "TRN-8841". */
  code: string;
  status: AppointmentStatus;
  startAt: IsoDateTime;
  /** Duración del servicio (sin prep/limpieza). */
  endAt: IsoDateTime;
  /** Sólo en CREATED. */
  holdExpiresAt: IsoDateTime | null;
  price: number;
  depositAmount: number;
  remainingAmount: number;
  service: { id: string; name: string; durationMinutes: number };
  provider: ProviderSummary & { bankDetails: BankDetails };
  client: ClientSummary;
  /** Último comprobante informado. */
  deposit: Deposit | null;
  rescheduled: boolean;
  rescheduleReason: string | null;
  cancellationReason: string | null;
  cancelledBy: CancelledBy | null;
  depositOutcome: DepositOutcome | null;
  createdAt: IsoDateTime;
}

export interface AvailableSlot {
  startAt: IsoDateTime;
  endAt: IsoDateTime;
  /** Quiénes pueden atender en ese horario exacto. */
  providers: ProviderSummary[];
  /** true = pegado a otro turno/borde de jornada → "Turno continuo sin demoras". */
  contiguous: boolean;
}

export interface DaySlots {
  date: DateKey;
  serviceId: string;
  slots: AvailableSlot[];
}

export interface GuestData {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email?: string;
}

export interface CreateAppointmentInput {
  serviceId: string;
  startAt: IsoDateTime;
  providerId?: string;
  guest?: GuestData;
  recommendationId?: string;
}

export interface CreateAppointmentResult {
  appointment: Appointment;
  guestAccessToken: string | null;
}

export interface RescheduleInput {
  startAt: IsoDateTime;
  providerId?: string;
  reason: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
  password: string;
}

export interface RegisterResult {
  user: SessionUser;
  linkedAppointments: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MyAppointments {
  active: Appointment[];
  history: Appointment[];
}

export type DepositInboxItem = Deposit & { appointment: Appointment };

export interface DepositInboxMeta {
  total: number;
  pendingAmount: number;
}

export interface WorkingRange {
  startTime: TimeOfDay;
  endTime: TimeOfDay;
}

export type AgendaProviderColumn = ProviderSummary & {
  workingRanges: WorkingRange[];
  appointments: Appointment[];
};

export interface AgendaDaySummary {
  appointments: number;
  capacityMinutes: number;
  bookedMinutes: number;
  pendingDeposits: number;
  freeGaps: number;
}

export interface AgendaDay {
  date: DateKey;
  providers: AgendaProviderColumn[];
  summary: AgendaDaySummary;
}

export interface ServiceInput {
  name: string;
  description?: string;
  imageUrl?: string;
  durationMinutes: number;
  price: number;
  prepMinutes: number;
  cleanupMinutes: number;
  categoryIds: string[];
  providerIds: string[];
  recommendationTags: string[];
  specificDates: DateKey[];
  isActive: boolean;
}

export interface CategoryInput {
  name: string;
  isActive: boolean;
}

export interface TreatmentInput {
  name: string;
  description?: string;
  /** Ordenados. */
  serviceIds: string[];
  recommendationTags: string[];
  isActive: boolean;
}

export interface CreateProviderInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  displayName: string;
  specialty?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateProviderInput {
  displayName: string;
  specialty?: string;
  bio?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export type ClientDetail = ClientSummary & { appointments: Appointment[] };

export interface MoneyByPeriod {
  today: number;
  last24h: number;
  week: number;
  month: number;
}

export interface Dashboard {
  generatedAt: IsoDateTime;
  daily: {
    appointmentsToday: number;
    paymentsInformed: number;
    paymentsVerified: number;
    paymentsRejected: number;
    paymentsPendingReview: number;
    cancellationsToday: number;
  };
  occupancy: { todayPercent: number; weekPercent: number; freeMinutesBetweenAppointmentsToday: number };
  monthly: {
    servicesPerformed: number;
    topService: { id: string; name: string; count: number } | null;
    uniqueClients: number;
  };
  economic: {
    servicesValue: MoneyByPeriod;
    verifiedDeposits: MoneyByPeriod;
    byProvider: Array<{ providerId: string; displayName: string; value: number; appointments: number }>;
  };
}

export const REPORT_TYPES = [
  'appointments',
  'services',
  'providers',
  'cancellations',
  'agenda-efficiency',
  'recommendations',
] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export type RecommendationOutcome = 'PENDING' | 'ACCEPTED' | 'DISCARDED';

export interface Recommendation {
  id: string;
  createdAt: IsoDateTime;
  answers: Record<string, string>;
  type: 'SERVICE' | 'TREATMENT';
  confidence: number;
  source: 'LAYA' | 'RULES';
  service: Service | null;
  treatment: Treatment | null;
  outcome: RecommendationOutcome;
  ledToBooking: boolean;
}
