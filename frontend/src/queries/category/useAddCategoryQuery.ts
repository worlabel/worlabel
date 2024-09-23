import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProjectCategories } from '@/api/categoryApi';
import { LabelCategoryRequest } from '@/types';

export default function useAddCategoryQuery(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: LabelCategoryRequest) => addProjectCategories(projectId, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectCategories', projectId] });
    },
  });
}
