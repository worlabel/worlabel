import { uploadImageFolderFile } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';
import { UploadFolderParams } from '@/types/uploadTypes';

export default function useUploadImageFolderFileQuery() {
  return useMutation({
    mutationFn: ({ memberId, projectId, folderId, files, progressCallback }: UploadFolderParams) =>
      uploadImageFolderFile(memberId, projectId, folderId, files, progressCallback),
  });
}
