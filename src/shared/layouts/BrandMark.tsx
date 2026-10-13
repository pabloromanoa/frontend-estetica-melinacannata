import { Link } from 'react-router';
import { BUSINESS_NAME, BUSINESS_TAGLINE } from '@/config/constants';

export function BrandMark({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-3" aria-label={`${BUSINESS_NAME} — inicio`}>
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-full border border-border-strong text-[10px] font-semibold tracking-widest text-primary"
      >
        MC
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-semibold text-ink">{BUSINESS_NAME}</span>
        <span className="block text-sm text-ink-soft">{BUSINESS_TAGLINE}</span>
      </span>
    </Link>
  );
}
