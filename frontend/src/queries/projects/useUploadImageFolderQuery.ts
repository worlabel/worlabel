import { uploadImageFolder } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';

export default function useUploadImageFolderQuery() {
  return useMutation({
    mutationFn: ({ memberId, projectId, files }: { memberId: number; projectId: number; files: File[] }) =>
      uploadImageFolder(memberId, projectId, files),
  });
}
