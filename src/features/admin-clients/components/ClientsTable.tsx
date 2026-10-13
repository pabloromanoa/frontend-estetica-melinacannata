import { Link } from 'react-router';
import type { ClientSummary } from '@/domain';
import { Badge, EmptyState } from '@/shared/ui';

export function ClientsTable({ clients }: { clients: readonly ClientSummary[] }) {
  if (clients.length === 0)
    return <EmptyState title="Sin resultados" description="Probá con otro nombre, DNI o teléfono." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-ink-soft">
          <tr>
            <th scope="col" className="py-2 pr-4">
              Paciente
            </th>
            <th scope="col" className="py-2 pr-4">
              DNI
            </th>
            <th scope="col" className="py-2 pr-4">
              Teléfono
            </th>
            <th scope="col" className="py-2 pr-4">
              Email
            </th>
            <th scope="col" className="py-2">
              Cuenta
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="py-3 pr-4">
                <Link
                  to={`/panel/clientes/${client.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {client.lastName}, {client.firstName}
                </Link>
              </td>
              <td className="py-3 pr-4">{client.dni}</td>
              <td className="py-3 pr-4">{client.phone}</td>
              <td className="py-3 pr-4">{client.email ?? '—'}</td>
              <td className="py-3">
                {client.hasAccount ? <Badge tone="success">Registrado</Badge> : <Badge>Invitado</Badge>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
