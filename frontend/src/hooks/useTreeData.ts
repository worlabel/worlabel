import { useState, useCallback, useEffect } from 'react';
import { TreeNode } from 'react-treebeard';
import { ImageResponse, ChildFolder } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getFolder } from '@/api/folderApi';

export function useFolder(projectId: string, folderId: number) {
  return useQuery({
    queryKey: ['folder', projectId, folderId],
    queryFn: () => getFolder(projectId, folderId),
    enabled: folderId === 0,
  });
}

export function useChildFolder(projectId: string, folderId: number, enabled: boolean) {
  return useQuery({
    queryKey: ['folder', projectId, folderId],
    queryFn: () => getFolder(projectId, folderId),
    enabled: enabled,
  });
}

export default function useTreeData(projectId: string) {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);

  const { data: rootFolder, isLoading: isRootLoading } = useFolder(projectId, 0);

  const { data: childFolder, isFetching: isChildLoading } = useChildFolder(
    projectId,
    currentFolderId || 0,
    currentFolderId !== null
  );

  useEffect(() => {
    if (rootFolder) {
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
    }
  }, [rootFolder]);

  useEffect(() => {
    if (childFolder && currentFolderId !== null) {
      const childFolders: TreeNode[] =
        childFolder.children?.map((child: ChildFolder) => ({
          id: child.id.toString(),
          name: child.title,
          children: [],
        })) || [];

      const images: TreeNode[] =
        childFolder.images?.map((image: ImageResponse) => ({
          id: image.id.toString(),
          name: image.imageTitle,
          imageData: image,
          children: [],
        })) || [];

      setTreeData((prevData) => {
        if (!prevData) return null;

        const updateNode = (currentNode: TreeNode): TreeNode => {
          if (currentNode.id === currentFolderId.toString()) {
            return {
              ...currentNode,
              children: [...childFolders, ...images],
              toggled: true,
            };
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
    }
  }, [childFolder, currentFolderId]);

  const fetchNodeData = useCallback((node: TreeNode) => {
    setCurrentFolderId(Number(node.id));
  }, []);

  return {
    treeData,
    fetchNodeData,
    setTreeData,
    isLoading: isRootLoading || isChildLoading,
  };
}
