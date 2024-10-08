import { getFolderReviewList } from '@/api/folderApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useFolderReviewListQuery(projectId: number, folderId: number, memberId: number) {
  return useSuspenseQuery({
    queryKey: ['folderReviewList', projectId, folderId, memberId],
    queryFn: () => getFolderReviewList(projectId, folderId, memberId),
  });
}
