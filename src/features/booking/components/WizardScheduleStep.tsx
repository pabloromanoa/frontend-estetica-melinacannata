import { toDateKey, type AvailableSlot, type DateKey } from '@/domain';
import { Button, ErrorState, LoadingBlock } from '@/shared/ui';
import { DayPicker } from './DayPicker';
import { SlotPicker } from './SlotPicker';

interface WizardScheduleStepProps {
  date: DateKey;
  onDateChange: (date: DateKey) => void;
  allowedDates: readonly DateKey[];
  slots: {
    data?: AvailableSlot[];
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => unknown;
  };
  selected: AvailableSlot | null;
  recommendedKey: string | null;
  onSelect: (slot: AvailableSlot) => void;
  onContinue: () => void;
}

export function WizardScheduleStep({
  date,
  onDateChange,
  allowedDates,
  slots,
  selected,
  recommendedKey,
  onSelect,
  onContinue,
}: WizardScheduleStepProps) {
  return (
    <div className="space-y-6">
      <DayPicker
        today={toDateKey(new Date())}
        value={date}
        onChange={onDateChange}
        allowedDates={allowedDates}
      />
      {slots.isLoading && <LoadingBlock label="Buscando horarios…" />}
      {slots.isError && <ErrorState error={slots.error} onRetry={() => void slots.refetch()} />}
      {slots.data && (
        <SlotPicker
          slots={slots.data}
          selectedKey={selected?.startAt ?? null}
          recommendedKey={recommendedKey}
          onSelect={onSelect}
          emptyMessage="No hay horarios libres ese día. Probá con otra fecha."
        />
      )}
      <div className="flex justify-end">
        <Button size="lg" disabled={!selected} onClick={onContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
