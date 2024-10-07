import { useState, useCallback, useEffect } from 'react';
import { TreeNode } from 'react-treebeard';
import { FolderResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getFolder } from '@/api/folderApi';
import buildTreeNodes from '@/utils/buildTreeNodes';

function useFolder(projectId: string, folderId: number, enabled: boolean) {
  return useQuery({
    queryKey: ['folder', projectId, folderId],
    queryFn: () => getFolder(projectId, folderId),
    enabled,
  });
}

export default function useTreeData(projectId: string) {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [contextFolderId, setContextFolderId] = useState<number | null>(null);

  // 루트 폴더 데이터
  const { data: rootFolder, isLoading: isRootLoading } = useFolder(projectId, 0, true);

  // 현재 선택된 폴더 데이터
  const { data: childFolder, isFetching: isChildLoading } = useFolder(
    projectId,
    currentFolderId || 0,
    currentFolderId !== null
  );

  // 컨텍스트 메뉴에서 선택된 폴더 데이터
  const { data: contextFolder, isFetching: isContextLoading } = useFolder(
    projectId,
    contextFolderId || 0,
    contextFolderId !== null
  );

  // 트리 데이터를 업데이트하는 함수
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
            ? { ...currentNode, children: currentNode.children.map(updateNode).filter(Boolean) }
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

  // 루트 폴더 데이터 로드
  useEffect(() => {
    if (!rootFolder) return;
    updateTreeData(rootFolder, true);
  }, [rootFolder, updateTreeData]);

  // 현재 선택된 폴더 데이터 업데이트
  useEffect(() => {
    if (!childFolder || currentFolderId === null) return;
    updateTreeData(childFolder);
  }, [childFolder, currentFolderId, updateTreeData]);

  // 컨텍스트 메뉴에서 선택된 폴더 데이터 업데이트
  useEffect(() => {
    if (!contextFolder || contextFolderId === null) return;
    -updateTreeData(contextFolder);
  }, [contextFolder, contextFolderId, updateTreeData]);

  // 현재 폴더 선택 시 폴더 ID 설정 함수
  const fetchNodeData = useCallback(
    (node: TreeNode) => {
      if (currentFolderId === Number(node.id)) return;
      setCurrentFolderId(Number(node.id));
    },
    [currentFolderId]
  );
  // 컨텍스트 메뉴 선택 시 폴더 ID 설정 함수
  const fetchContextFolderData = useCallback(
    (folderId: number | null) => {
      if (contextFolderId === folderId) return;
      setContextFolderId(folderId);
    },
    [contextFolderId]
  );

  return {
    treeData,
    fetchNodeData,
    fetchContextFolderData,
    setTreeData,
    isLoading: isRootLoading || isChildLoading || isContextLoading,
  };
}
