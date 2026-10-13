import { cn } from '@/shared/lib/cn';

const SIZES = { sm: 'size-4 border-2', md: 'size-6 border-2', lg: 'size-10 border-[3px]' } as const;

export function Spinner({
  size = 'md',
  label = 'Cargando',
  className,
}: {
  size?: keyof typeof SIZES;
  label?: string;
  className?: string;
}) {
  return (
    <span role="status" aria-label={label} className={cn('inline-block', className)}>
      <span
        className={cn('block animate-spin rounded-full border-current border-t-transparent', SIZES[size])}
      />
    </span>
  );
}

export function LoadingBlock({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft">
      <Spinner size="lg" label={label} className="text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
