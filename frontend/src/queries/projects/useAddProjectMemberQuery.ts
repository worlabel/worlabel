import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProjectMember } from '@/api/projectApi';
import { ProjectMemberRequest } from '@/types';

export default function useAddProjectMemberQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      newMember,
    }: {
      projectId: number;
      memberId: number;
      newMember: ProjectMemberRequest;
    }) => addProjectMember(projectId, memberId, newMember),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', variables.projectId] });
    },
  });
}
