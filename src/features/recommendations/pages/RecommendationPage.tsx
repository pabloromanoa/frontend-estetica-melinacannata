import { useNavigate } from 'react-router';
import { WandSparkles } from 'lucide-react';
import { recommendationBookingHref } from '@/domain';
import { getErrorMessage } from '@/shared/api';
import { Alert, Button, ErrorState, LoadingBlock } from '@/shared/ui';
import { QuestionnaireForm } from '../components/QuestionnaireForm';
import { RecommendationResult } from '../components/RecommendationResult';
import {
  useCreateRecommendation,
  useQuestionnaire,
  useRecommendationOutcome,
} from '../hooks/useRecommendations';

/** Recomendador (Laya): cuestionario → recomendación → aceptar/descartar. Funciona sin sesión. */
export function RecommendationPage() {
  const navigate = useNavigate();
  const questionnaire = useQuestionnaire();
  const create = useCreateRecommendation();
  const outcome = useRecommendationOutcome();
  const recommendation = outcome.data ?? create.data;

  const decide = (decision: 'ACCEPTED' | 'DISCARDED') => {
    if (!recommendation) return;
    outcome.mutate(
      { id: recommendation.id, outcome: decision },
      {
        onSuccess: (updated) => decision === 'ACCEPTED' && void navigate(recommendationBookingHref(updated)),
      },
    );
  };

  const restart = () => {
    create.reset();
    outcome.reset();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="flex items-center gap-3 text-3xl font-semibold text-ink">
          <WandSparkles className="size-7 text-primary" aria-hidden /> Recomendame
        </h1>
        <p className="mt-1 text-ink-soft">
          Respondé unas preguntas y Laya te sugiere el servicio o tratamiento ideal para vos.
        </p>
      </header>
      {questionnaire.isLoading && <LoadingBlock />}
      {questionnaire.isError && (
        <ErrorState error={questionnaire.error} onRetry={() => void questionnaire.refetch()} />
      )}
      {create.isError && <Alert tone="danger">{getErrorMessage(create.error)}</Alert>}
      {outcome.isError && <Alert tone="danger">{getErrorMessage(outcome.error)}</Alert>}
      {recommendation ? (
        <>
          <RecommendationResult
            recommendation={recommendation}
            isDeciding={outcome.isPending}
            onAccept={() => decide('ACCEPTED')}
            onDiscard={() => decide('DISCARDED')}
          />
          {recommendation.outcome === 'DISCARDED' && (
            <Alert tone="neutral">Descartaste esta recomendación.</Alert>
          )}
          <Button variant="link" onClick={restart}>
            Volver a responder el cuestionario
          </Button>
        </>
      ) : (
        questionnaire.data && (
          <QuestionnaireForm
            questions={questionnaire.data}
            isSubmitting={create.isPending}
            onSubmit={(answers) => create.mutate(answers)}
          />
        )
      )}
    </div>
  );
}
