import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFolder } from '@/api/folderApi';
import { FolderRequest } from '@/types';

interface UpdateFolderMutationVariables {
  projectId: number;
  folderId: number;
  memberId: number;
  folderData: FolderRequest;
}

export default function useUpdateFolderQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, folderId, memberId, folderData }: UpdateFolderMutationVariables) =>
      updateFolder(projectId, folderId, memberId, folderData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['folderList', variables.projectId, variables.folderId],
      });
    },
  });
}
