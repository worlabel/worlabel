import { TreeNode } from 'react-treebeard';

interface FlatNode extends TreeNode {
  depth: number;
  isLeaf: boolean;
  parent?: FlatNode;
  index?: number;
}

export default function moveNodeInTree(treeData: TreeNode, dragItem: FlatNode, hoverItem: FlatNode): TreeNode {
  if (!treeData) return treeData;

  // 드래그된 항목과 호버된 항목이 동일한 경우 이동 처리하지 않음
  if (dragItem.id === hoverItem.id) return treeData;

  // 부모 노드가 동일한 경우 중복 이동 처리하지 않음
  if (dragItem.parent?.id === hoverItem.parent?.id) return treeData;

  const updateTreeData = (node: TreeNode): TreeNode => {
    // 드래그된 노드의 부모에서 노드를 제거
    if (node.id === dragItem.parent?.id) {
      const newChildren = node.children?.filter((child) => child.id !== dragItem.id) || [];
      return { ...node, children: newChildren };
    }

    // 호버된 노드의 부모에 드래그된 노드 추가
    if (node.id === hoverItem.parent?.id) {
      const newChildren = [...(node.children || [])];
      const hoverIndex = newChildren.findIndex((child) => child.id === hoverItem.id);

      if (hoverIndex !== -1) {
        newChildren.splice(hoverIndex, 0, { ...dragItem, parent: hoverItem.parent } as FlatNode);
      }
      return { ...node, children: newChildren };
    }

    // 자식 노드가 존재하는 경우 자식 노드들을 순환하면서 업데이트
    return node.children ? { ...node, children: node.children.map(updateTreeData) } : node;
  };

  return updateTreeData(treeData);
}
