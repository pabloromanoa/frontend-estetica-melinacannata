import type { Question, Recommendation } from './types';

const PERCENT = 100;
const HIGH_CONFIDENCE = 0.75;
const MEDIUM_CONFIDENCE = 0.5;

/** El backend envía `confidence` en 0..1; si viniera en 0..100 también lo toleramos. */
export function confidencePercent(confidence: number): number {
  const ratio = confidence > 1 ? confidence / PERCENT : confidence;
  return Math.round(Math.min(1, Math.max(0, ratio)) * PERCENT);
}

export function confidenceLabel(confidence: number): string {
  const ratio = confidencePercent(confidence) / PERCENT;
  if (ratio >= HIGH_CONFIDENCE) return 'Alta coincidencia';
  if (ratio >= MEDIUM_CONFIDENCE) return 'Buena coincidencia';
  return 'Coincidencia parcial';
}

export const RECOMMENDATION_SOURCE_LABEL: Record<Recommendation['source'], string> = {
  LAYA: 'Laya (asistente inteligente)',
  RULES: 'Reglas del centro',
};

export const RECOMMENDATION_OUTCOME_LABEL: Record<Recommendation['outcome'], string> = {
  PENDING: 'Sin respuesta',
  ACCEPTED: 'Aceptada',
  DISCARDED: 'Descartada',
};

/** Nombre de lo recomendado (servicio o tratamiento). */
export function recommendationTitle(
  recommendation: Pick<Recommendation, 'type' | 'service' | 'treatment'>,
): string {
  if (recommendation.type === 'TREATMENT') return recommendation.treatment?.name ?? 'Tratamiento';
  return recommendation.service?.name ?? 'Servicio';
}

/** Todas las preguntas tienen respuesta. */
export function isQuestionnaireComplete(
  questions: readonly Question[],
  answers: Record<string, string>,
): boolean {
  return questions.every((question) => Boolean(answers[question.id]));
}

/** Etiqueta legible de una respuesta (para "Mis recomendaciones"). */
export function answerLabel(questions: readonly Question[], questionId: string, value: string): string {
  const question = questions.find((q) => q.id === questionId);
  return question?.options.find((option) => option.value === value)?.label ?? value;
}
