import { useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '@/shared/ui';
import { StaffSidebar } from './StaffSidebar';
import { StaffTopbar, type StaffTopbarProps } from './StaffTopbar';
import type { LayoutNavSection } from './types';

interface StaffLayoutProps extends Omit<StaffTopbarProps, 'onOpenMenu'> {
  sections: LayoutNavSection[];
  userName: string;
  userRole: string;
  onLogout: () => void;
  children: ReactNode;
}

/** Layout del panel interno (sidebar crema + topbar), según los prototipos. */
export function StaffLayout({
  sections,
  userName,
  userRole,
  onLogout,
  children,
  ...topbar
}: StaffLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarProps = { sections, userName, userRole, onLogout };
  return (
    <div className="min-h-screen bg-app lg:flex">
      <StaffSidebar {...sidebarProps} className="sticky top-0 hidden h-screen shrink-0 lg:flex" />
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex bg-overlay lg:hidden">
          <StaffSidebar {...sidebarProps} onNavigate={() => setMenuOpen(false)} className="shadow-raised" />
          <IconButton aria-label="Cerrar menú" className="m-3 bg-surface" onClick={() => setMenuOpen(false)}>
            <X className="size-5" />
          </IconButton>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <StaffTopbar {...topbar} onOpenMenu={() => setMenuOpen(true)} />
        <main id="contenido" className="px-4 pb-12 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
