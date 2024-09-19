import { getFolder } from '@/api/folderApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useFolderQuery(projectId: string, folderId: number) {
  return useSuspenseQuery({
    queryKey: ['folder', projectId, folderId],
    queryFn: () => getFolder(projectId, folderId),
  });
}
