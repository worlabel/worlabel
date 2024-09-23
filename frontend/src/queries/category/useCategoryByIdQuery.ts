import { getCategoryById } from '@/api/categoryApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useCategoryByIdQuery(projectId: number, categoryId: number) {
  return useSuspenseQuery({
    queryKey: ['category', projectId, categoryId],
    queryFn: () => getCategoryById(projectId, categoryId),
  });
}
