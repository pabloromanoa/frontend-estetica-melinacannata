import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { Lock } from 'lucide-react';
import { BUSINESS_NAME, BUSINESS_TAGLINE } from '@/config/constants';
import { cn } from '@/shared/lib/cn';
import { ButtonLink } from '@/shared/ui';
import { BrandMark } from './BrandMark';

interface PublicLayoutProps {
  /** Acción de cuenta: "Ingresar", "Mi cuenta" o "Panel". */
  account: { to: string; label: string };
  extraAction?: ReactNode;
  children: ReactNode;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'text-primary' : 'text-ink hover:text-primary',
  );

/** Layout del sitio público (catálogo, reserva, recomendador, enlace de invitado y portal del cliente). */
export function PublicLayout({ account, extraAction, children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-app">
      <header className="sticky top-0 z-30 border-b border-border bg-app/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
          <BrandMark />
          <nav aria-label="Principal" className="ml-auto flex flex-wrap items-center gap-1">
            <NavLink to="/" end className={linkClass}>
              Servicios
            </NavLink>
            <NavLink to="/recomendame" className={linkClass}>
              Recomendame
            </NavLink>
            {extraAction}
            <ButtonLink to={account.to} variant="secondary" size="sm" className="ml-2">
              {account.label}
            </ButtonLink>
            <ButtonLink to="/reservar" size="sm">
              Reservar turno
            </ButtonLink>
          </nav>
        </div>
      </header>
      <main id="contenido" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-ink-soft">
          <span className="flex items-center gap-2">
            <Lock className="size-4" aria-hidden /> Pago seguro • {BUSINESS_NAME} {BUSINESS_TAGLINE}
          </span>
          <span>© {BUSINESS_NAME}</span>
        </div>
      </footer>
    </div>
  );
}
