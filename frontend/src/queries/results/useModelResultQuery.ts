import { useSuspenseQuery } from '@tanstack/react-query';
import { getModelResult } from '@/api/resultApi';
import { ResultResponse } from '@/types';

export default function useModelResultsQuery(modelId: number) {
  return useSuspenseQuery<ResultResponse[]>({
    queryKey: ['modelResults', modelId],
    queryFn: () => getModelResult(modelId),
  });
}
