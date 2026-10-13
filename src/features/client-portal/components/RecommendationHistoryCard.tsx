import { Link } from 'react-router';
import {
  confidencePercent,
  formatShortDate,
  RECOMMENDATION_OUTCOME_LABEL,
  RECOMMENDATION_SOURCE_LABEL,
  recommendationTitle,
  type Recommendation,
} from '@/domain';
import { Badge } from '@/shared/ui';

/** Recomendación pasada (sólo lectura). */
export function RecommendationHistoryCard({ recommendation }: { recommendation: Recommendation }) {
  const href =
    recommendation.type === 'TREATMENT' && recommendation.treatment
      ? `/tratamientos/${recommendation.treatment.id}`
      : recommendation.service
        ? `/servicios/${recommendation.service.id}`
        : null;
  return (
    <article className="rounded-2xl bg-surface p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-ink-soft">
          {recommendation.type === 'TREATMENT' ? 'Tratamiento' : 'Servicio'} ·{' '}
          {formatShortDate(recommendation.createdAt)}
        </p>
        <Badge tone={recommendation.outcome === 'ACCEPTED' ? 'success' : 'neutral'}>
          {RECOMMENDATION_OUTCOME_LABEL[recommendation.outcome]}
        </Badge>
      </div>
      <h3 className="mt-1 text-lg font-semibold text-ink">
        {href ? (
          <Link to={href} className="hover:text-primary">
            {recommendationTitle(recommendation)}
          </Link>
        ) : (
          recommendationTitle(recommendation)
        )}
      </h3>
      <p className="text-sm text-ink-soft">
        Confianza {confidencePercent(recommendation.confidence)}% ·{' '}
        {RECOMMENDATION_SOURCE_LABEL[recommendation.source]}
        {recommendation.ledToBooking && ' · Generó una reserva'}
      </p>
    </article>
  );
}
