import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWorkspace } from '@/api/workspaceApi';

export default function useDeleteWorkspaceQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, memberId }: { workspaceId: number; memberId: number }) =>
      deleteWorkspace(workspaceId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
    },
  });
}
