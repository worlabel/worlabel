import { fetchFolder } from '@/api/folderApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useFolderQuery(projectId: number, folderId: number, memberId: number) {
  return useSuspenseQuery({
    queryKey: ['folder', projectId, folderId, memberId],
    queryFn: () => fetchFolder(projectId, folderId, memberId),
  });
}
