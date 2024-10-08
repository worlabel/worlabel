import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWorkspace } from '@/api/workspaceApi';
import { WorkspaceRequest } from '@/types';

export default function useCreateWorkspaceQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: number; data: WorkspaceRequest }) => createWorkspace(memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceList'] });
    },
  });
}
