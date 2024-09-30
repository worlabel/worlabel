import { uploadImageZip } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';

export default function useUploadImageZipQuery() {
  return useMutation({
    mutationFn: ({
      memberId,
      projectId,
      folderId,
      file,
      progressCallback,
    }: {
      memberId: number;
      projectId: number;
      folderId: number;
      file: File;
      progressCallback: (progress: number) => void;
    }) => uploadImageZip(memberId, projectId, folderId, file, progressCallback),
  });
}
