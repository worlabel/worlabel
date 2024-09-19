import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/api/projectApi';
import { ProjectRequest } from '@/types';

export default function useCreateProjectQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, memberId, data }: { workspaceId: number; memberId: number; data: ProjectRequest }) =>
      createProject(workspaceId, memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] });
    },
  });
}
