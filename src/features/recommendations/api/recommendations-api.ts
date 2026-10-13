import type { Question, Recommendation } from '@/domain';
import { httpClient } from '@/shared/api';

export type RecommendationDecision = 'ACCEPTED' | 'DISCARDED';

export const recommendationsApi = {
  questionnaire: () => httpClient.get<Question[]>('/recommendations/questionnaire'),
  create: (answers: Record<string, string>) =>
    httpClient.post<Recommendation>('/recommendations', { answers }),
  outcome: (id: string, outcome: RecommendationDecision) =>
    httpClient.post<Recommendation>(`/recommendations/${id}/outcome`, { outcome }),
};
