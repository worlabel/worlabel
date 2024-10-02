import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFolder } from '@/api/folderApi';
import { FolderRequest } from '@/types';

interface CreateFolderMutationVariables {
  projectId: number;
  memberId: number;
  folderData: FolderRequest;
}

export default function useCreateFolderQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, memberId, folderData }: CreateFolderMutationVariables) =>
      createFolder(projectId, memberId, folderData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['folderList', variables.projectId, variables.memberId],
      });
    },
  });
}
