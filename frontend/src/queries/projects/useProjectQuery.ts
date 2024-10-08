import { getProject } from '@/api/projectApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProjectQuery(projectId: number, memberId: number) {
  return useSuspenseQuery({
    queryKey: ['project', projectId, memberId],
    queryFn: () => getProject(projectId, memberId),
  });
}
