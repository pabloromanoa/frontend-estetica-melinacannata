import { LayoutDashboard, RefreshCw } from 'lucide-react';
import { formatDateTimeLong } from '@/domain';
import { Button, ErrorState, LoadingBlock, PageHeader } from '@/shared/ui';
import {
  ByProviderSection,
  DailySection,
  EconomicSection,
  OccupancySection,
} from '../components/DashboardSections';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard();
  return (
    <>
      <PageHeader
        title="Dashboard"
        icon={<LayoutDashboard className="size-7" />}
        description={
          data ? `Datos generados el ${formatDateTimeLong(data.generatedAt)}` : 'Indicadores del negocio.'
        }
        actions={
          <Button
            variant="secondary"
            onClick={() => void refetch()}
            loading={isFetching}
            leftIcon={<RefreshCw className="size-4" aria-hidden />}
          >
            Actualizar datos
          </Button>
        }
      />
      {isLoading && <LoadingBlock />}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {data && (
        <div className="grid gap-6 xl:grid-cols-2">
          <DailySection daily={data.daily} />
          <OccupancySection occupancy={data.occupancy} monthly={data.monthly} />
          <EconomicSection economic={data.economic} />
          <ByProviderSection rows={data.economic.byProvider} />
        </div>
      )}
    </>
  );
}
