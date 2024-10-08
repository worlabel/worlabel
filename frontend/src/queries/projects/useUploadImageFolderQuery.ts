import { uploadImageFolder } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';

export default function useUploadImageFolderQuery() {
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
    }) => uploadImageFolder(memberId, projectId, folderId, files, progressCallback),
  });
}
