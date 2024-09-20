import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeWorkspaceMember } from '@/api/workspaceApi';

export default function useRemoveWorkspaceMemberQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
      targetMemberId,
    }: {
      workspaceId: number;
      memberId: number;
      targetMemberId: number;
    }) => removeWorkspaceMember(workspaceId, memberId, targetMemberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] });
    },
  });
}
