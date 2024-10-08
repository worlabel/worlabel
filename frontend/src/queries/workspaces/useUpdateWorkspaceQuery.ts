import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWorkspace } from '@/api/workspaceApi';
import { WorkspaceRequest } from '@/types';

export default function useUpdateWorkspaceQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, memberId, data }: { workspaceId: number; memberId: number; data: WorkspaceRequest }) =>
      updateWorkspace(workspaceId, memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
    },
  });
}
