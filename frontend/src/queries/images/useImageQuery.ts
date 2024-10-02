import { getImage } from '@/api/imageApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useImageQuery(imageId: number, memberId: number) {
  return useSuspenseQuery({
    queryKey: ['image', imageId, memberId],
    queryFn: () => getImage(imageId, memberId),
  });
}
