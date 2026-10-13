import type { ComponentType } from 'react';

export interface LayoutNavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string | null;
}

export interface LayoutNavSection {
  title: string;
  items: LayoutNavItem[];
}
