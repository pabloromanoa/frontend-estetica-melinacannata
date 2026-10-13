import { Sparkles } from 'lucide-react';
import {
  confidenceLabel,
  confidencePercent,
  formatARS,
  RECOMMENDATION_SOURCE_LABEL,
  recommendationTitle,
  type Recommendation,
} from '@/domain';
import { TreatmentServicesList } from '@/features/catalog';
import { Badge, Button, Card } from '@/shared/ui';

interface RecommendationResultProps {
  recommendation: Recommendation;
  onAccept: () => void;
  onDiscard: () => void;
  isDeciding: boolean;
}

export function RecommendationResult({
  recommendation,
  onAccept,
  onDiscard,
  isDeciding,
}: RecommendationResultProps) {
  const percent = confidencePercent(recommendation.confidence);
  const { service, treatment } = recommendation;
  const decided = recommendation.outcome !== 'PENDING';
  return (
    <Card>
      <p className="flex items-center gap-2 text-sm text-ink-soft">
        <Sparkles className="size-4 text-primary" aria-hidden /> Te recomendamos{' '}
        {recommendation.type === 'TREATMENT' ? 'el tratamiento' : 'el servicio'}
      </p>
      <h2 className="mt-1 text-3xl font-semibold text-ink">{recommendationTitle(recommendation)}</h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge tone="success">{confidenceLabel(recommendation.confidence)}</Badge>
        <span className="text-sm text-ink-soft">
          Fuente: {RECOMMENDATION_SOURCE_LABEL[recommendation.source]}
        </span>
      </div>
      <div className="mt-3" aria-label={`Confianza ${percent}%`}>
        <div className="mb-1 flex justify-between text-xs text-ink-soft">
          <span>Confianza</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-sunken" aria-hidden>
          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
      </div>
      {service && (
        <div className="mt-6 rounded-xl bg-surface-muted p-4">
          {service.description && <p className="text-ink">{service.description}</p>}
          <p className="mt-2 text-sm text-ink-soft">
            {service.durationMinutes} min · {formatARS(service.price)} · seña{' '}
            {formatARS(service.depositAmount)}
          </p>
        </div>
      )}
      {treatment && (
        <div className="mt-6 space-y-3">
          {treatment.description && <p className="text-ink">{treatment.description}</p>}
          <TreatmentServicesList services={treatment.services} />
          <p className="text-sm text-ink-soft">
            Cada servicio se reserva por separado, con su propio turno y su seña.
          </p>
        </div>
      )}
      {!decided && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" onClick={onAccept} loading={isDeciding}>
            {recommendation.type === 'TREATMENT'
              ? 'Quiero seguir este tratamiento'
              : 'Reservar este servicio'}
          </Button>
          <Button size="lg" variant="secondary" onClick={onDiscard} disabled={isDeciding}>
            Descartar
          </Button>
        </div>
      )}
    </Card>
  );
}
