import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProjectMemberPrivilege } from '@/api/projectApi';
import { ProjectMemberRequest } from '@/types';

export default function useUpdateProjectMemberPrivilegeQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      privilegeData,
    }: {
      projectId: number;
      memberId: number;
      privilegeData: ProjectMemberRequest;
    }) => updateProjectMemberPrivilege(projectId, memberId, privilegeData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', variables.projectId] });
    },
  });
}
