import { getWorkspace } from '@/api/workspaceApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useWorkspaceQuery(workspaceId: number, memberId: number) {
  return useSuspenseQuery({
    queryKey: ['workspace', workspaceId, memberId],
    queryFn: () => getWorkspace(workspaceId, memberId),
  });
}
