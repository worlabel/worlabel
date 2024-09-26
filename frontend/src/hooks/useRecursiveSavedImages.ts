import { useCallback, useEffect, useState } from 'react';
import useFolderQuery from '@/queries/folders/useFolderQuery';
import { ImageResponse, ChildFolder } from '@/types';
import { getFolder } from '@/api/folderApi';

export default function useRecursiveSavedImages(projectId: string, folderId: number) {
  const [allSavedImages, setAllSavedImages] = useState<ImageResponse[]>([]);
  const { data: folderData, isLoading, error } = useFolderQuery(projectId, folderId);

  const fetchAllSavedImages = useCallback(
    async (folderId: number): Promise<ImageResponse[]> => {
      const folder = await getFolder(projectId, folderId);

      const childFolderImagesPromises = folder.children.map(async (childFolder: ChildFolder) => {
        return fetchAllSavedImages(childFolder.id);
      });

      const childFolderImages = await Promise.all(childFolderImagesPromises);

      const savedImages = folder.images.filter((image) => image.status === 'SAVE');
      console.log(savedImages);
      return [...savedImages, ...childFolderImages.flat()];
    },
    [projectId]
  );

  useEffect(() => {
    const getAllSavedImages = async () => {
      if (folderData) {
        const images = await fetchAllSavedImages(folderId);
        setAllSavedImages(images);
      }
    };

    getAllSavedImages();
  }, [folderData, fetchAllSavedImages, folderId]);

  return { allSavedImages, isLoading, error };
}
