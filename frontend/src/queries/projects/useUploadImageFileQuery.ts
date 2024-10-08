import { uploadImageFile } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';

export default function useUploadImageFileQuery() {
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
    }) => uploadImageFile(memberId, projectId, folderId, files, progressCallback),
  });
}
