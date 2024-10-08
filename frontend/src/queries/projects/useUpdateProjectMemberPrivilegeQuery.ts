import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProjectMemberPrivilege } from '@/api/projectApi';
import { ProjectMemberResponse } from '@/types';

export default function useUpdateProjectMemberPrivilegeQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      privilegeType,
    }: {
      projectId: number;
      memberId: number;
      privilegeType: ProjectMemberResponse['privilegeType'];
    }) => updateProjectMemberPrivilege(projectId, memberId, privilegeType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', variables.projectId] });
    },
  });
}
