import { NavLink } from 'react-router';
import { LogOut } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Avatar, IconButton } from '@/shared/ui';
import { BrandMark } from './BrandMark';
import type { LayoutNavSection } from './types';

interface StaffSidebarProps {
  sections: LayoutNavSection[];
  userName: string;
  userRole: string;
  onLogout: () => void;
  onNavigate?: () => void;
  className?: string;
}

export function StaffSidebar({
  sections,
  userName,
  userRole,
  onLogout,
  onNavigate,
  className,
}: StaffSidebarProps) {
  return (
    <aside className={cn('flex h-full w-72 flex-col bg-sidebar px-5 py-6', className)}>
      <BrandMark to="/panel/agenda" />
      <nav aria-label="Menú del panel" className="mt-10 flex-1 space-y-8 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-ink-soft">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/panel/turnos' ? false : undefined}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                        isActive
                          ? 'bg-sidebar-active text-lg text-primary'
                          : 'text-ink hover:bg-sidebar-active/60',
                      )
                    }
                  >
                    <item.icon className="size-5 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-warning-bg px-2 py-0.5 text-xs font-semibold text-pending">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card">
        <Avatar name={userName} size="md" className="bg-primary text-on-primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{userName}</p>
          <p className="truncate text-sm text-ink-soft">{userRole}</p>
        </div>
        <IconButton aria-label="Cerrar sesión" size="sm" onClick={onLogout}>
          <LogOut className="size-4" />
        </IconButton>
      </div>
    </aside>
  );
}
