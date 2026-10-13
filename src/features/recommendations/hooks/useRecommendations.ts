import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import { recommendationsApi, type RecommendationDecision } from '../api/recommendations-api';

export function useQuestionnaire() {
  return useQuery({
    queryKey: queryKeys.recommendations.questionnaire,
    queryFn: recommendationsApi.questionnaire,
    staleTime: Infinity,
  });
}

export function useCreateRecommendation() {
  return useMutation({ mutationFn: recommendationsApi.create });
}

export function useRecommendationOutcome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, outcome }: { id: string; outcome: RecommendationDecision }) =>
      recommendationsApi.outcome(id, outcome),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.recommendations.mine }),
  });
}
