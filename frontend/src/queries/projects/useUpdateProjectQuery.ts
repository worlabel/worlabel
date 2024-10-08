import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '@/api/projectApi';
import { ProjectRequest } from '@/types';

export default function useUpdateProjectQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, memberId, data }: { projectId: number; memberId: number; data: ProjectRequest }) =>
      updateProject(projectId, memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}
