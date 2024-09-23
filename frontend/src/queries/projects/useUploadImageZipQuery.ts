import { uploadImageZip } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';

export default function useUploadImageZipQuery() {
  return useMutation({
    mutationFn: ({ memberId, projectId, file }: { memberId: number; projectId: number; file: File }) =>
      uploadImageZip(memberId, projectId, file),
  });
}
