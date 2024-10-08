import { useMemo } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import useProjectMembersQuery from '@/queries/projects/useProjectMembersQuery';

export default function useIsAdmin(projectId: number) {
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: projectMembers = [] } = useProjectMembersQuery(projectId, memberId);

  const isAdminOrManager = useMemo(() => {
    const currentMember = projectMembers.find((member) => member.memberId === memberId);
    return currentMember?.privilegeType === 'ADMIN';
  }, [projectMembers, memberId]);

  return isAdminOrManager;
}
