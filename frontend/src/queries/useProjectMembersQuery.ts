import { getProjectMembers } from '@/api/projectApi';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ProjectMemberResponse } from '@/types';

export default function useProjectMembersQuery(projectId: number, memberId: number) {
  return useSuspenseQuery<ProjectMemberResponse[]>({
    queryKey: ['projectMembers', projectId, memberId],
    queryFn: () => getProjectMembers(projectId, memberId),
  });
}
