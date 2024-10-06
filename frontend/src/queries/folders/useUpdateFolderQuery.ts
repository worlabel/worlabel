import { useMutation } from '@tanstack/react-query';
import { updateFolder } from '@/api/folderApi';
import { FolderRequest } from '@/types';

interface UpdateFolderMutationVariables {
  projectId: number;
  folderId: number;
  folderData: FolderRequest;
}

export default function useUpdateFolderQuery() {
  return useMutation({
    mutationFn: ({ projectId, folderId, folderData }: UpdateFolderMutationVariables) =>
      updateFolder(projectId, folderId, folderData),
  });
}
