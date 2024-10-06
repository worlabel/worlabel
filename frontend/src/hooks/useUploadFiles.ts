import useCreateFolderQuery from '@/queries/folders/useCreateFolderQuery';
import useUploadImagePresignedQuery from '@/queries/images/useUploadImagePresignedQuery';

export default function useUploadFiles() {
  const uploadImageMutation = useUploadImagePresignedQuery();
  const createFolderMutation = useCreateFolderQuery();

  const uploadFiles = async ({
    files,
    projectId,
    folderId,
    memberId,
    onProgress,
  }: {
    files: { path: string; file: File }[];
    projectId: number;
    folderId: number;
    memberId: number;
    onProgress: (progress: number) => void;
  }) => {
    const folderIdMap: { [path: string]: number } = { '': folderId };

    const foldersToCreate = Array.from(new Set(files.map(({ path }) => path.split('/').slice(0, -1).join('/'))));
    foldersToCreate.sort();

    for (const folderPath of foldersToCreate) {
      if (folderPath) {
        const pathSegments = folderPath.split('/');
        const parentPath = pathSegments.slice(0, -1).join('/');
        const folderName = pathSegments[pathSegments.length - 1];

        const parentId = folderIdMap[parentPath] || folderId;

        const newFolder = await createFolderMutation.mutateAsync({
          projectId,
          memberId,
          folderData: {
            title: folderName,
            parentId: parentId,
          },
        });

        folderIdMap[folderPath] = newFolder.id;
      }
    }

    let progress = 0;
    const totalFiles = files.length;

    for (const { path, file } of files) {
      const folderPath = path.split('/').slice(0, -1).join('/');
      const targetFolderId = folderIdMap[folderPath] || folderId;

      await uploadImageMutation.mutateAsync({
        memberId,
        projectId,
        folderId: targetFolderId,
        files: [file],
        progressCallback: (value) => {
          progress += value / totalFiles;
          onProgress(Math.round(progress));
        },
      });
    }
  };

  return { uploadFiles };
}
