import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeProjectMember } from '@/api/projectApi';

export default function useRemoveProjectMemberQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, targetMemberId }: { projectId: number; targetMemberId: number }) =>
      removeProjectMember(projectId, targetMemberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', variables.projectId] });
    },
  });
}
