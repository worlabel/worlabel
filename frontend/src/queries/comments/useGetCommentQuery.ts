import { getComment } from '@/api/commentAPi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useGetCommentQuery(projectId: number, commentId: number) {
  return useSuspenseQuery({
    queryKey: ['comment', projectId, commentId],
    queryFn: () => getComment(projectId, commentId),
  });
}
