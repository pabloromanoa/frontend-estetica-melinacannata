import { Outlet, useNavigate } from 'react-router';
import { addDays, formatLongDay, ROLE_LABEL } from '@/domain';
import { useAuth, useLogout } from '@/features/auth';
import { usePendingDepositsCount } from '@/features/deposits';
import { StaffLayout, type LayoutNavSection } from '@/shared/layouts';
import { navigationFor } from '../navigation';
import { useDateParam } from '@/shared/hooks';

/** Conecta el layout presentacional del panel con sesión, navegación por rol y contadores. */
export function StaffShell() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const logout = useLogout();
  const pending = usePendingDepositsCount(Boolean(user));
  const { date, isToday } = useDateParam();

  const sections: LayoutNavSection[] = navigationFor(user?.roles ?? []).map((section) => ({
    title: section.title,
    items: section.items.map((item) => ({
      to: item.to,
      label: item.label,
      icon: item.icon,
      badge: item.badge === 'pendingDeposits' && pending > 0 ? `${pending} pend.` : null,
    })),
  }));

  const goToDay = (offset: number) => void navigate(`/panel/agenda?fecha=${addDays(date, offset)}`);

  return (
    <StaffLayout
      sections={sections}
      userName={user ? `${user.firstName} ${user.lastName}` : ''}
      userRole={(user?.roles ?? []).map((role) => ROLE_LABEL[role]).join(' · ')}
      onLogout={() => logout.mutate(undefined, { onSettled: () => void navigate('/ingresar') })}
      dateLabel={isToday ? `Hoy, ${formatLongDay(date)}` : formatLongDay(date)}
      onPrevDay={() => goToDay(-1)}
      onNextDay={() => goToDay(1)}
      onSearch={(term) =>
        void navigate(term ? `/panel/turnos?buscar=${encodeURIComponent(term)}` : '/panel/turnos')
      }
      hasNotifications={pending > 0}
    >
      <Outlet />
    </StaffLayout>
  );
}
