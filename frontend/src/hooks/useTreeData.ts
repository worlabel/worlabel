import { useState, useCallback } from 'react';
import { TreeNode } from 'react-treebeard';
import { getFolder } from '@/api/folderApi';
import { ImageResponse, ChildFolder } from '@/types';

export default function useTreeData(projectId: string) {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);

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
  };
}
