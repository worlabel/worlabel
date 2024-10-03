import { getImage } from '@/api/imageApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useImageQuery(projectId: number, folderId: number, imageId: number) {
  return useSuspenseQuery({
    queryKey: ['image', projectId, folderId, imageId],
    queryFn: () => getImage(projectId, folderId, imageId),
  });
}
