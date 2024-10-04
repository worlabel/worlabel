import { useState, useCallback, useEffect } from 'react';
import { TreeNode } from 'react-treebeard';
import { FolderResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getFolder } from '@/api/folderApi';
import buildTreeNodes from '@/utils/buildTreeNodes';

function useFolder(projectId: string, folderId: number, enabled: boolean = folderId === 0) {
  return useQuery({
    queryKey: ['folder', projectId, folderId],
    queryFn: () => getFolder(projectId, folderId),
    enabled,
  });
}

export default function useTreeData(projectId: string) {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);

  const { data: rootFolder, isLoading: isRootLoading } = useFolder(projectId, 0);
  const { data: childFolder, isFetching: isChildLoading } = useFolder(
    projectId,
    currentFolderId || 0,
    currentFolderId !== null
  );

  const updateTreeData = useCallback((folder: FolderResponse, isRoot: boolean = false) => {
    if (!folder) return;

    const childNodes = buildTreeNodes(folder);

    setTreeData((prevData) => {
      if (isRoot || !prevData) {
        return {
          id: folder.id.toString(),
          name: folder.title,
          children: childNodes,
          toggled: true,
        };
      }

      const updateNode = (currentNode: TreeNode): TreeNode => {
        if (currentNode.id !== folder.id.toString()) {
          return currentNode.children
            ? { ...currentNode, children: currentNode.children.map(updateNode) }
            : currentNode;
        }

        return {
          ...currentNode,
          children: childNodes,
          toggled: true,
        };
      };

      return updateNode(prevData);
    });
  }, []);

  useEffect(() => {
    if (!rootFolder) return;
    updateTreeData(rootFolder, true);
  }, [rootFolder, updateTreeData]);

  useEffect(() => {
    if (!childFolder || currentFolderId === null) return;
    updateTreeData(childFolder);
  }, [childFolder, currentFolderId, updateTreeData]);

  const fetchNodeData = useCallback(
    (node: TreeNode) => {
      if (currentFolderId === Number(node.id)) return;
      setCurrentFolderId(Number(node.id));
    },
    [currentFolderId]
  );

  return {
    treeData,
    fetchNodeData,
    setTreeData,
    isLoading: isRootLoading || isChildLoading,
  };
}
