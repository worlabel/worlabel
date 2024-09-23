import { getModelCategories } from '@/api/modelApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useModelCategoriesQuery(modelId: number) {
  return useSuspenseQuery({
    queryKey: ['modelCategories', modelId],
    queryFn: () => getModelCategories(modelId),
  });
}
