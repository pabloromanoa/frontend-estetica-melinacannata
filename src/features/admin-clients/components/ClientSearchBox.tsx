import { useState } from 'react';
import { Search } from 'lucide-react';
import type { ClientSummary } from '@/domain';
import { Avatar, Input, Spinner } from '@/shared/ui';
import { useClientSearch } from '../hooks/useClients';

/** Buscador de pacientes existentes (nombre, DNI o teléfono). */
export function ClientSearchBox({
  onPick,
  id = 'client-search',
}: {
  onPick: (client: ClientSummary) => void;
  id?: string;
}) {
  const [term, setTerm] = useState('');
  const results = useClientSearch(term, { requireTerm: true });

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        Buscar paciente existente
      </label>
      <div className="relative">
        <Search className="absolute top-3 left-3 size-4 text-ink-soft" aria-hidden />
        <Input
          id={id}
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Nombre, DNI o teléfono…"
          className="pl-9"
        />
        {results.isFetching && <Spinner size="sm" className="absolute top-3 right-3 text-ink-soft" />}
      </div>
      {results.data && results.data.length > 0 && (
        <ul
          className="max-h-56 divide-y divide-border overflow-y-auto rounded-xl border border-border bg-surface"
          aria-label="Resultados"
        >
          {results.data.map((client) => (
            <li key={client.id}>
              <button
                type="button"
                onClick={() => {
                  onPick(client);
                  setTerm('');
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-surface-muted"
              >
                <Avatar name={`${client.firstName} ${client.lastName}`} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">
                    {client.lastName}, {client.firstName}
                  </span>
                  <span className="text-xs text-ink-soft">
                    DNI {client.dni} · {client.phone}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {results.data?.length === 0 && (
        <p className="text-sm text-ink-soft">No hay coincidencias. Cargá los datos abajo.</p>
      )}
    </div>
  );
}
