import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import { availabilityApi, type DaySlotsParams, type NextSlotsParams } from '../api/availability-api';

export function useDaySlots(params: Partial<DaySlotsParams>) {
  const ready = Boolean(params.serviceId && params.date);
  const query = {
    serviceId: params.serviceId ?? '',
    date: params.date ?? '',
    providerId: params.providerId || undefined,
  };
  return useQuery({
    queryKey: queryKeys.availability.slots(query),
    queryFn: () => availabilityApi.daySlots(query),
    enabled: ready,
    select: (data) => data.slots,
  });
}

export function useNextSlots(params: Partial<NextSlotsParams>) {
  const query = { ...params, serviceId: params.serviceId ?? '', providerId: params.providerId || undefined };
  return useQuery({
    queryKey: queryKeys.availability.nextSlots(query),
    queryFn: () => availabilityApi.nextSlots(query),
    enabled: Boolean(params.serviceId),
  });
}
