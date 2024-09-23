import { getProjectCategories } from '@/api/categoryApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProjectCategoriesQuery(projectId: number) {
  return useSuspenseQuery({
    queryKey: ['projectCategories', projectId],
    queryFn: () => getProjectCategories(projectId),
  });
}
