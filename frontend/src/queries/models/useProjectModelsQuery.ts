import { getProjectModels } from '@/api/modelApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProjectModelsQuery(projectId: number) {
  return useSuspenseQuery({
    queryKey: ['projectModels', projectId],
    queryFn: () => getProjectModels(projectId),
    refetchOnWindowFocus: false,
  });
}
