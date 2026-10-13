import type { ProviderSummary } from '@/domain';
import { cn } from '@/shared/lib/cn';
import { Avatar } from '@/shared/ui';

interface ProviderChooserProps {
  providers: readonly ProviderSummary[];
  value: string | null;
  onChange: (providerId: string | null) => void;
}

/** Prestador opcional: "Sin preferencia" o uno puntual. */
export function ProviderChooser({ providers, value, onChange }: ProviderChooserProps) {
  const option = (id: string | null, title: string, subtitle: string, avatar?: ProviderSummary) => (
    <label
      key={id ?? 'any'}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors',
        value === id
          ? 'border-primary bg-primary-soft'
          : 'border-border bg-surface hover:border-border-strong',
      )}
    >
      <input
        type="radio"
        name="provider"
        checked={value === id}
        onChange={() => onChange(id)}
        className="size-4 accent-primary"
      />
      {avatar ? (
        <Avatar name={avatar.displayName} src={avatar.avatarUrl} />
      ) : (
        <Avatar name="?" className="bg-surface-sunken text-ink-soft" />
      )}
      <span>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="text-sm text-ink-soft">{subtitle}</span>
      </span>
    </label>
  );
  return (
    <fieldset className="grid gap-3 sm:grid-cols-2">
      <legend className="sr-only">Profesional</legend>
      {option(null, 'Sin preferencia', 'Te asignamos quien tenga el horario libre')}
      {providers.map((provider) =>
        option(provider.id, provider.displayName, provider.specialty ?? 'Profesional', provider),
      )}
    </fieldset>
  );
}
