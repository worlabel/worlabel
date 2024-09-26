import { useMutation } from '@tanstack/react-query';
import { changeImageStatus } from '@/api/imageApi';
import { ImageStatusChangeRequest } from '@/types';

export default function useChangeImageStatusQuery(onSuccess?: () => void) {
  return useMutation({
    mutationFn: ({
      imageId,
      memberId,
      statusChangeRequest,
    }: {
      imageId: number;
      memberId: number;
      statusChangeRequest: ImageStatusChangeRequest;
    }) => changeImageStatus(imageId, memberId, statusChangeRequest),
    onSuccess,
  });
}
