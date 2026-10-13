import { useSearchParams } from 'react-router';
import { Search, Users } from 'lucide-react';
import { Card, ErrorState, Input, LoadingBlock, PageHeader } from '@/shared/ui';
import { ClientsTable } from '../components/ClientsTable';
import { useClientSearch } from '../hooks/useClients';

export function ClientsPage() {
  const [params, setParams] = useSearchParams();
  const term = params.get('buscar') ?? '';
  const clients = useClientSearch(term);

  return (
    <>
      <PageHeader
        title="Clientes"
        icon={<Users className="size-7" />}
        description="Buscá pacientes por nombre, DNI o teléfono y consultá su historial."
      />
      <Card>
        <div className="relative mb-4 max-w-md">
          <Search className="absolute top-3 left-3 size-4 text-ink-soft" aria-hidden />
          <label htmlFor="clients-search" className="sr-only">
            Buscar clientes
          </label>
          <Input
            id="clients-search"
            type="search"
            className="pl-9"
            placeholder="Nombre, DNI o teléfono…"
            value={term}
            onChange={(e) => setParams(e.target.value ? { buscar: e.target.value } : {}, { replace: true })}
          />
        </div>
        {clients.isLoading && <LoadingBlock />}
        {clients.isError && <ErrorState error={clients.error} onRetry={() => void clients.refetch()} />}
        {clients.data && <ClientsTable clients={clients.data} />}
      </Card>
    </>
  );
}
