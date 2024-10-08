import { useMutation } from '@tanstack/react-query';
import { deleteFolder } from '@/api/folderApi';

interface DeleteFolderMutationVariables {
  projectId: number;
  folderId: number;
  memberId: number;
}

export default function useDeleteFolderQuery() {
  return useMutation({
    mutationFn: ({ projectId, folderId, memberId }: DeleteFolderMutationVariables) =>
      deleteFolder(projectId, folderId, memberId),
  });
}
