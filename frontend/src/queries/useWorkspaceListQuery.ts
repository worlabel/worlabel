import { getWorkspaceList } from '@/api/workspaceApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useWorkspaceListQuery(memberId: number, lastWorkspaceId?: number, limit?: number) {
  return useSuspenseQuery({
    queryKey: ['workspaceList'],
    queryFn: () => getWorkspaceList(memberId, lastWorkspaceId, limit),
  });
}
