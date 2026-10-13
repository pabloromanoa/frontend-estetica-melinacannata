import type { ProviderSummary } from '@/domain';
import { Avatar } from '@/shared/ui';

export function ProviderList({ providers }: { providers: readonly ProviderSummary[] }) {
  if (providers.length === 0)
    return <p className="text-sm text-ink-soft">Sin profesionales asignados por el momento.</p>;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {providers.map((provider) => (
        <li key={provider.id} className="flex items-center gap-3 rounded-xl bg-surface-muted p-3">
          <Avatar name={provider.displayName} src={provider.avatarUrl} />
          <div>
            <p className="font-semibold text-ink">{provider.displayName}</p>
            {provider.specialty && <p className="text-sm text-primary">{provider.specialty}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
