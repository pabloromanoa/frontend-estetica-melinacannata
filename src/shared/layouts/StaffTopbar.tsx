import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Bell, CalendarDays, ChevronLeft, ChevronRight, Menu, Plus, Search, UserRound } from 'lucide-react';
import { ButtonLink, IconButton } from '@/shared/ui';

export interface StaffTopbarProps {
  dateLabel: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onSearch: (term: string) => void;
  hasNotifications: boolean;
  onOpenMenu: () => void;
}

export function StaffTopbar({
  dateLabel,
  onPrevDay,
  onNextDay,
  onSearch,
  hasNotifications,
  onOpenMenu,
}: StaffTopbarProps) {
  const [term, setTerm] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(term.trim());
  };

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 bg-app/90 px-4 py-4 backdrop-blur md:px-8">
      <IconButton aria-label="Abrir menú" className="lg:hidden" onClick={onOpenMenu}>
        <Menu className="size-5" />
      </IconButton>
      <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 shadow-card">
        <CalendarDays className="size-5 text-primary" aria-hidden />
        <span className="font-semibold text-ink">{dateLabel}</span>
        <IconButton aria-label="Día anterior" size="sm" onClick={onPrevDay}>
          <ChevronLeft className="size-4" />
        </IconButton>
        <IconButton aria-label="Día siguiente" size="sm" onClick={onNextDay}>
          <ChevronRight className="size-4" />
        </IconButton>
      </div>
      <form
        role="search"
        onSubmit={submit}
        className="order-last flex min-w-64 flex-1 items-center gap-2 rounded-xl bg-surface px-3 py-2 shadow-card md:order-none"
      >
        <Search className="size-4 text-ink-soft" aria-hidden />
        <label htmlFor="staff-search" className="sr-only">
          Buscar paciente
        </label>
        <input
          id="staff-search"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Buscar paciente por nombre o WhatsApp..."
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
        />
      </form>
      <div className="ml-auto flex items-center gap-3">
        <ButtonLink to="/panel/nueva-reserva" size="lg" leftIcon={<Plus className="size-5" aria-hidden />}>
          Agendar Turno
        </ButtonLink>
        <Link
          to="/panel/senas"
          aria-label={hasNotifications ? 'Hay señas pendientes de validar' : 'Notificaciones'}
          className="relative grid size-12 place-items-center rounded-full bg-surface-sunken text-ink hover:bg-sidebar-active"
        >
          <Bell className="size-5" aria-hidden />
          {hasNotifications && (
            <span className="absolute top-2.5 right-3 size-2.5 rounded-full bg-danger" aria-hidden />
          )}
        </Link>
        <span aria-hidden className="grid size-12 place-items-center rounded-full bg-primary text-on-primary">
          <UserRound className="size-5" />
        </span>
      </div>
    </header>
  );
}
