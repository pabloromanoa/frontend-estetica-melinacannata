import { useSearchParams } from 'react-router';
import { useAdminProviders } from '@/features/admin-providers';
import { useAuth } from '@/features/auth';
import { useServices } from '@/features/catalog';
import { getErrorMessage } from '@/shared/api';
import { Alert, EmptyState, ErrorState, FormField, LoadingBlock, PageHeader, Select } from '@/shared/ui';
import type { ProviderScope } from '../api/availability-admin-api';
import { AssignedServicesCard } from '../components/AssignedServicesCard';
import { BankDetailsCard } from '../components/BankDetailsCard';
import { ExceptionsCard } from '../components/ExceptionsCard';
import { ProviderHeaderCard } from '../components/ProviderHeaderCard';
import { WeeklyMatrixCard } from '../components/WeeklyMatrixCard';
import { useAvailabilityEditor } from '../hooks/useAvailabilityEditor';
import {
  useProviderProfile,
  useSaveWeeklyAvailability,
  useUpdateBankDetails,
  useUpdateProviderServices,
  useWeeklyAvailability,
} from '../hooks/useProviderAvailability';

function useScope(): { scope: ProviderScope | null; setProvider: (id: string) => void } {
  const { user, isAdmin } = useAuth();
  const [params, setParams] = useSearchParams();
  const requested = params.get('providerId');
  const setProvider = (id: string) => setParams({ providerId: id }, { replace: true });
  if (isAdmin && requested && requested !== user?.providerId)
    return { scope: { kind: 'admin', providerId: requested }, setProvider };
  if (user?.providerId) return { scope: { kind: 'self' }, setProvider };
  return { scope: null, setProvider };
}

/** Disponibilidad Semanal (prototipo disponibilidad-semanal). */
export function AvailabilityPage() {
  const { isAdmin } = useAuth();
  const { scope, setProvider } = useScope();
  const providers = useAdminProviders(isAdmin);

  if (!scope) {
    return (
      <>
        <PageHeader
          title="Disponibilidad Semanal"
          description="Elegí la profesional cuya agenda querés configurar."
        />
        <FormField label="Profesional" htmlFor="availability-provider" className="max-w-sm">
          <Select
            id="availability-provider"
            defaultValue=""
            onChange={(e) => e.target.value && setProvider(e.target.value)}
          >
            <option value="">Elegí…</option>
            {providers.data?.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.displayName}
              </option>
            ))}
          </Select>
        </FormField>
      </>
    );
  }
  return (
    <AvailabilityEditorView
      key={scope.kind === 'admin' ? scope.providerId : 'me'}
      scope={scope}
      providers={isAdmin ? providers.data : undefined}
      onChangeProvider={setProvider}
    />
  );
}

function AvailabilityEditorView({
  scope,
  providers,
  onChangeProvider,
}: {
  scope: ProviderScope;
  providers?: Parameters<typeof ProviderHeaderCard>[0]['providers'];
  onChangeProvider: (id: string) => void;
}) {
  const profile = useProviderProfile(scope);
  const weekly = useWeeklyAvailability(scope);
  const services = useServices();
  const editor = useAvailabilityEditor(weekly.data);
  const saveWeekly = useSaveWeeklyAvailability(scope);
  const saveBank = useUpdateBankDetails(scope);
  const saveServices = useUpdateProviderServices(scope);

  if (profile.isLoading || weekly.isLoading) return <LoadingBlock label="Cargando disponibilidad…" />;
  if (profile.isError || weekly.isError) return <ErrorState error={profile.error ?? weekly.error} />;
  if (!profile.data) return <EmptyState title="No encontramos a la profesional" />;

  return (
    <div className="space-y-6">
      <ProviderHeaderCard
        provider={profile.data}
        providers={providers}
        onChangeProvider={onChangeProvider}
        dirty={editor.dirty}
        isSaving={saveWeekly.isPending}
        onSave={() => saveWeekly.mutate(editor.toRanges())}
      />
      {saveWeekly.isError && <Alert tone="danger">{getErrorMessage(saveWeekly.error)}</Alert>}
      {saveWeekly.isSuccess && !editor.dirty && (
        <Alert tone="success">Horario sincronizado con recepción.</Alert>
      )}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <WeeklyMatrixCard editor={editor} />
        <div className="space-y-6">
          <AssignedServicesCard
            services={services.data ?? []}
            assignedIds={profile.data.serviceIds}
            isSaving={saveServices.isPending}
            error={saveServices.error}
            saved={saveServices.isSuccess}
            onSave={(ids) => saveServices.mutate(ids)}
          />
          <BankDetailsCard
            bankDetails={profile.data.bankDetails}
            isSaving={saveBank.isPending}
            error={saveBank.error}
            saved={saveBank.isSuccess}
            onSave={(bank) => saveBank.mutate(bank)}
          />
        </div>
      </div>
      <ExceptionsCard scope={scope} />
    </div>
  );
}
