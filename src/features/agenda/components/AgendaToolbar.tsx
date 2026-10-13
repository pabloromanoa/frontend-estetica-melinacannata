import { Filter } from 'lucide-react';
import { ALL_APPOINTMENT_STATUSES, getStatusMeta, type AppointmentStatus, type Category } from '@/domain';
import { CategoryFilter } from '@/features/catalog';
import { Select, Tabs } from '@/shared/ui';

export type AgendaView = 'day' | 'week';

interface AgendaToolbarProps {
  view: AgendaView;
  onViewChange: (view: AgendaView) => void;
  categories: readonly Category[];
  categoryId: string | null;
  onCategoryChange: (id: string | null) => void;
  status: AppointmentStatus | null;
  onStatusChange: (status: AppointmentStatus | null) => void;
}

const VIEWS = [
  { id: 'day', label: 'Día' },
  { id: 'week', label: 'Semana' },
] as const;

export function AgendaToolbar({
  view,
  onViewChange,
  categories,
  categoryId,
  onCategoryChange,
  status,
  onStatusChange,
}: AgendaToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-surface-sunken/60 p-4">
      <Tabs
        label="Vista de agenda"
        items={VIEWS}
        value={view}
        onChange={onViewChange}
        className="bg-surface-sunken"
      />
      <span className="hidden h-8 w-px bg-border-strong md:block" aria-hidden />
      <CategoryFilter categories={categories} value={categoryId} onChange={onCategoryChange} />
      <div className="ml-auto flex items-center gap-2">
        <Filter className="size-4 text-ink-soft" aria-hidden />
        <label htmlFor="agenda-status" className="sr-only">
          Filtrar por estado de seña
        </label>
        <Select
          id="agenda-status"
          value={status ?? ''}
          onChange={(e) => onStatusChange((e.target.value || null) as AppointmentStatus | null)}
          className="w-60"
        >
          <option value="">Todos los estados de seña</option>
          {ALL_APPOINTMENT_STATUSES.filter((value) => value !== 'CANCELLED' && value !== 'EXPIRED').map(
            (value) => (
              <option key={value} value={value}>
                {getStatusMeta(value).badge}
              </option>
            ),
          )}
        </Select>
      </div>
    </div>
  );
}
