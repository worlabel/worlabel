import { useMutation } from '@tanstack/react-query';
import { createFolder } from '@/api/folderApi';
import { FolderRequest } from '@/types';

interface CreateFolderMutationVariables {
  projectId: number;
  folderData: FolderRequest;
}

export default function useCreateFolderQuery() {
  return useMutation({
    mutationFn: ({ projectId, folderData }: CreateFolderMutationVariables) => createFolder(projectId, folderData),
  });
}
