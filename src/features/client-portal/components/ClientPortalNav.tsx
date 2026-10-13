import { NavLink } from 'react-router';
import { cn } from '@/shared/lib/cn';

const ITEMS = [
  { to: '/mi-cuenta', label: 'Mis turnos', end: true },
  { to: '/mi-cuenta/recomendaciones', label: 'Mis recomendaciones', end: false },
] as const;

export function ClientPortalNav() {
  return (
    <nav aria-label="Mi cuenta" className="mb-6 flex gap-2 border-b border-border">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              '-mb-px border-b-2 px-4 py-2 text-sm font-medium',
              isActive ? 'border-primary text-primary' : 'border-transparent text-ink-soft hover:text-ink',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
