import { ButtonLink, EmptyState, ErrorState, LoadingBlock } from '@/shared/ui';
import { ClientPortalNav } from '../components/ClientPortalNav';
import { RecommendationHistoryCard } from '../components/RecommendationHistoryCard';
import { useMyRecommendations } from '../hooks/useClientPortal';

export function MyRecommendationsPage() {
  const { data, isLoading, isError, error, refetch } = useMyRecommendations();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold text-ink">Mis recomendaciones</h1>
      <ClientPortalNav />
      {isLoading && <LoadingBlock />}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {data?.length === 0 && (
        <EmptyState
          title="Todavía no pediste recomendaciones"
          action={<ButtonLink to="/recomendame">Pedir una recomendación</ButtonLink>}
        />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((recommendation) => (
          <RecommendationHistoryCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </div>
    </div>
  );
}
