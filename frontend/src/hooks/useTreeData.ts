import { useState, useCallback, useEffect } from 'react';
import { TreeNode } from 'react-treebeard';
import { getFolder } from '@/api/folderApi';
import { ImageResponse, ChildFolder } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useFolder(projectId: string, folderId: number, enabled: boolean) {
  return useQuery({
    queryKey: ['folder', projectId, folderId],
    queryFn: () => getFolder(projectId, folderId),
    enabled: enabled,
  });
}

export default function useTreeData(projectId: string, folderId: number) {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);

  const { data: folder, isLoading } = useFolder(projectId, folderId, true);

  useEffect(() => {
    if (folder) {
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

      const rootNode: TreeNode = {
        id: folder.id.toString(),
        name: folder.title,
        children: [...childFolders, ...images],
        toggled: true,
      };

      setTreeData(rootNode);
    }
  }, [folder]);

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

        setTreeData((prevData) => {
          if (!prevData) return null;

          const updateNode = (currentNode: TreeNode): TreeNode => {
            if (currentNode.id === node.id) {
              return { ...node };
            }
            if (currentNode.children) {
              return {
                ...currentNode,
                children: currentNode.children.map(updateNode),
              };
            }
            return currentNode;
          };

          return updateNode(prevData);
        });
      } catch (error) {
        node.loading = false;
      }
    },
    [projectId]
  );

  return {
    treeData,
    fetchNodeData,
    setTreeData,
    isLoading,
  };
}
