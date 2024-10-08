import { uploadImageZip } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';
import { UploadZipParams } from '@/types/uploadTypes';

export default function useUploadImageZipQuery() {
  return useMutation({
    mutationFn: ({ memberId, projectId, folderId, file, progressCallback }: UploadZipParams) =>
      uploadImageZip(memberId, projectId, folderId, file, progressCallback),
  });
}
