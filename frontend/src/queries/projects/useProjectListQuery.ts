import { getProjectList } from '@/api/projectApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProjectListQuery(workspaceId: number, memberId: number) {
  return useSuspenseQuery({
    queryKey: ['projects', workspaceId, memberId],
    queryFn: () => getProjectList(workspaceId, memberId),
  });
}
