import { uploadImageFile } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';

export default function useUploadImageFileQuery() {
  return useMutation({
    mutationFn: ({
      memberId,
      projectId,
      folderId,
      files,
    }: {
      memberId: number;
      projectId: number;
      folderId: number;
      files: File[];
    }) => uploadImageFile(memberId, projectId, folderId, files),
  });
}
