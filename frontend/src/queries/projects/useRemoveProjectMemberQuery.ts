import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeProjectMember } from '@/api/projectApi';

export default function useRemoveProjectMemberQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      targetMemberId,
    }: {
      projectId: number;
      memberId: number;
      targetMemberId: number;
    }) => removeProjectMember(projectId, memberId, targetMemberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', variables.projectId] });
    },
  });
}
