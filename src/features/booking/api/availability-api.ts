import type { AvailableSlot, DateKey, DaySlots } from '@/domain';
import { httpClient } from '@/shared/api';

export interface DaySlotsParams {
  serviceId: string;
  date: DateKey;
  providerId?: string;
}

export interface NextSlotsParams {
  serviceId: string;
  providerId?: string;
  fromDate?: DateKey;
  days?: number;
  limit?: number;
}

export const availabilityApi = {
  daySlots: (params: DaySlotsParams) =>
    httpClient.get<DaySlots>('/availability/slots', { query: { ...params } }),
  nextSlots: (params: NextSlotsParams) =>
    httpClient.get<AvailableSlot[]>('/availability/next-slots', { query: { ...params } }),
};
