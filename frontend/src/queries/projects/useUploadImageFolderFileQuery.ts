import { uploadImageFolderFile } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';

export default function useUploadImageFolderFileQuery() {
  return useMutation({
    mutationFn: ({
      memberId,
      projectId,
      folderId,
      files,
      progressCallback,
    }: {
      memberId: number;
      projectId: number;
      folderId: number;
      files: File[];
      progressCallback: (progress: number) => void;
    }) => uploadImageFolderFile(memberId, projectId, folderId, files, progressCallback),
  });
}
