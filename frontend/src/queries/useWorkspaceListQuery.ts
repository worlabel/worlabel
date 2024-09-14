import { fetchWorkspaceList } from '@/api/workspaceApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useWorkspaceListQuery(memberId: number, lastWorkspaceId?: number, limit?: number) {
  return useSuspenseQuery({
    queryKey: ['workspaceList'],
    queryFn: () => fetchWorkspaceList(memberId, lastWorkspaceId, limit),
  });
}
