import { uploadImagePresigned } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';
import { UploadFolderParams } from '@/types/uploadTypes';

export default function useUploadImagePresignedQuery() {
  return useMutation({
    mutationFn: ({ memberId, projectId, folderId, files, progressCallback }: UploadFolderParams) =>
      uploadImagePresigned(memberId, projectId, folderId, files, progressCallback),
  });
}
