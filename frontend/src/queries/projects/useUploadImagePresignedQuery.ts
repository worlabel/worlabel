import { uploadImagePresigned } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';

export default function useUploadImagePresignedQuery() {
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
      progressCallback: (index: number) => void;
    }) => uploadImagePresigned(memberId, projectId, folderId, files, progressCallback),
  });
}