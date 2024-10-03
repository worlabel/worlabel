import { getImage } from '@/api/imageApi';
import { useQuery } from '@tanstack/react-query';

export default function useImage(projectId: number, folderId: number, imageId: number) {
  return useQuery({
    queryKey: ['image', projectId, folderId, imageId],
    queryFn: () => getImage(projectId, folderId, imageId),
    enabled: Boolean(projectId && folderId && imageId),
  });
}
