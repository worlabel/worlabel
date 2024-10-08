import { getCommentList } from '@/api/commentAPi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useCommentListQuery(projectId: number, imageId: number) {
  return useSuspenseQuery({
    queryKey: ['commentList', projectId, imageId],
    queryFn: () => getCommentList(projectId, imageId),
  });
}
