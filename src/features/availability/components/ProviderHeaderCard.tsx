import { ArrowLeftRight, Check } from 'lucide-react';
import type { Provider } from '@/domain';
import { Avatar, Badge, Button, Card, Select } from '@/shared/ui';

interface ProviderHeaderCardProps {
  provider: Provider;
  /** Sólo ADMIN: listado para "Cambiar Profesional". */
  providers?: readonly Provider[];
  onChangeProvider?: (id: string) => void;
  onSave: () => void;
  isSaving: boolean;
  dirty: boolean;
}

export function ProviderHeaderCard({
  provider,
  providers,
  onChangeProvider,
  onSave,
  isSaving,
  dirty,
}: ProviderHeaderCardProps) {
  return (
    <Card className="flex flex-wrap items-center gap-4 p-5">
      <Avatar name={provider.displayName} src={provider.avatarUrl} size="lg" />
      <div className="min-w-0 flex-1">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-semibold text-ink">
          {provider.displayName}
          {provider.isActive ? <Badge tone="success">Activa</Badge> : <Badge>Inactiva</Badge>}
        </h1>
        <p className="text-ink-soft">{provider.specialty ?? 'Profesional'}</p>
      </div>
      {providers && onChangeProvider && (
        <label className="flex items-center gap-2 rounded-xl bg-surface-sunken px-3 py-1 text-ink">
          <ArrowLeftRight className="size-4" aria-hidden />
          <span className="sr-only">Cambiar Profesional</span>
          <Select
            value={provider.id}
            onChange={(e) => onChangeProvider(e.target.value)}
            className="h-9 w-56 border-0 bg-transparent"
            aria-label="Cambiar Profesional"
          >
            {providers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.displayName}
              </option>
            ))}
          </Select>
        </label>
      )}
      <Button
        onClick={onSave}
        loading={isSaving}
        disabled={!dirty}
        leftIcon={<Check className="size-4" aria-hidden />}
      >
        Guardar Horarios
      </Button>
    </Card>
  );
}
