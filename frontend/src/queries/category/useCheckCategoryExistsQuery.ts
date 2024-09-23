import { checkCategoryExists } from '@/api/categoryApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useCheckCategoryExistsQuery(projectId: number, categoryName: string) {
  return useSuspenseQuery({
    queryKey: ['categoryExists', projectId, categoryName],
    queryFn: () => checkCategoryExists(projectId, categoryName),
  });
}
