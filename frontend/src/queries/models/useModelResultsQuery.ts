import { useSuspenseQuery } from '@tanstack/react-query';
import { getModelResults } from '@/api/modelApi';
import { ResultResponse } from '@/types';

export default function useModelResultsQuery(modelId: number) {
  return useSuspenseQuery<ResultResponse[]>({
    queryKey: ['modelResults', modelId],
    queryFn: () => getModelResults(modelId),
  });
}
