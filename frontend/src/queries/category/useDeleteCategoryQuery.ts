import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory } from '@/api/categoryApi';

export default function useDeleteCategoryQuery(projectId: number, categoryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCategory(projectId, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectCategories', projectId] });
    },
  });
}
