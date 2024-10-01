import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFolder } from '@/api/folderApi';

interface DeleteFolderMutationVariables {
  projectId: number;
  folderId: number;
  memberId: number;
}

export default function useDeleteFolderQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, folderId, memberId }: DeleteFolderMutationVariables) =>
      deleteFolder(projectId, folderId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['folderList', variables.projectId, variables.folderId],
      });
    },
  });
}
