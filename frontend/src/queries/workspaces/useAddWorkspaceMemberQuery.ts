import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addWorkspaceMember } from '@/api/workspaceApi';

export default function useAddWorkspaceMemberQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
      newMemberId,
    }: {
      workspaceId: number;
      memberId: number;
      newMemberId: number;
    }) => addWorkspaceMember(workspaceId, memberId, newMemberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] });
    },
  });
}
