import { fetchWorkspace } from '@/api/workspaceApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useWorkspaceQuery(workspaceId: number, memberId: number) {
  return useSuspenseQuery({
    queryKey: ['workspace', workspaceId, memberId],
    queryFn: () => fetchWorkspace(workspaceId, memberId),
  });
}
