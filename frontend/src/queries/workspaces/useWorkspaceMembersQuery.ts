import { getWorkspaceMembers } from '@/api/workspaceApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useWorkspaceMembersQuery(workspaceId: number) {
  return useSuspenseQuery({
    queryKey: ['workspaceMembers', workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId),
  });
}
