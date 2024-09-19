import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '@/api/projectApi';

export default function useDeleteProjectQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: number; memberId: number }) =>
      deleteProject(projectId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
  });
}
