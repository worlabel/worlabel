import { useState, useCallback } from 'react';
import { TreeNode } from 'react-treebeard';
import { getFolder } from '@/api/folderApi';
import { ImageResponse, ChildFolder } from '@/types';

export default function useTreeData(projectId: string, initialFolderId: number) {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNodeData = useCallback(
    async (node: TreeNode) => {
      node.loading = true;

      try {
        const folder = await getFolder(projectId, Number(node.id));
        const childFolders: TreeNode[] =
          folder.children?.map((child: ChildFolder) => ({
            id: child.id.toString(),
            name: child.title,
            children: [],
          })) || [];

        const images: TreeNode[] =
          folder.images?.map((image: ImageResponse) => ({
            id: image.id.toString(),
            name: image.imageTitle,
            imageData: image,
            children: [],
          })) || [];

        node.children = [...childFolders, ...images];
        node.loading = false;
        node.toggled = true;
        setTreeData((prevData) => ({ ...prevData! }));
      } catch (error) {
        node.loading = false;
        console.error(`Error fetching data for node ${node.id}:`, error);
      }
    },
    [projectId]
  );

  const initializeTree = useCallback(async () => {
    setIsLoading(true);
    try {
      const rootFolder = await getFolder(projectId, initialFolderId);
      const childFolders: TreeNode[] =
        rootFolder.children?.map((child: ChildFolder) => ({
          id: child.id.toString(),
          name: child.title,
          children: [],
        })) || [];

      const images: TreeNode[] =
        rootFolder.images?.map((image: ImageResponse) => ({
          id: image.id.toString(),
          name: image.imageTitle,
          imageData: image,
          children: [],
        })) || [];

      const rootNode: TreeNode = {
        id: rootFolder.id.toString(),
        name: rootFolder.title,
        children: [...childFolders, ...images],
        toggled: true,
      };

      setTreeData(rootNode);
    } catch (error) {
      console.error('Error initializing tree data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, initialFolderId]);

  return {
    treeData,
    fetchNodeData,
    initializeTree,
    setTreeData,
    isLoading,
  };
}
