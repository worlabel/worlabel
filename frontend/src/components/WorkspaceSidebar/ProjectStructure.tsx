import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { TreeNode } from 'react-treebeard';
import useProjectStore from '@/stores/useProjectStore';
import useCanvasStore from '@/stores/useCanvasStore';
import useTreeData from '@/hooks/useTreeData';
import { Project, ImageResponse, ImageStatus } from '@/types';
import WorkspaceDropdownMenu from '../WorkspaceDropdownMenu';
import AutoLabelButton from './AutoLabelButton';
import useMoveImageQuery from '@/queries/images/useMoveImageQuery';
import { Folder, Image as ImageIcon, Minus, Loader, ArrowDownToLine, Send, CircleSlash, Check } from 'lucide-react';
import { Spinner } from '../ui/spinner';

import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface FlatNode extends TreeNode {
  depth: number;
  isLeaf: boolean;
  parent?: FlatNode;
  index?: number;
}

const ItemTypes = {
  NODE: 'node',
};

export default function ProjectStructure({ project }: { project: Project }) {
  const { setProject } = useProjectStore();
  const { setImage } = useCanvasStore();
  const { treeData, fetchNodeData, initializeTree, setTreeData, isLoading } = useTreeData(project.id.toString(), 0);
  const [cursor, setCursor] = useState<TreeNode | null>(null);
  const moveImageMutation = useMoveImageQuery();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(400);

  useEffect(() => {
    setProject(project);
    initializeTree();
  }, [project, setProject, initializeTree]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, [containerRef, treeData, isLoading]);

  const onToggle = useCallback(
    async (node: TreeNode, toggled: boolean) => {
      if (cursor) {
        cursor.active = false;
      }
      node.active = true;
      setCursor(node);

      if (node.imageData) {
        setImage(node.imageData as ImageResponse);
      } else {
        if (toggled && (!node.children || node.children.length === 0)) {
          await fetchNodeData(node);
        }

        const updateNode = (currentNode: TreeNode): TreeNode => {
          if (currentNode.id === node.id) {
            return { ...currentNode, toggled };
          }
          if (currentNode.children) {
            return {
              ...currentNode,
              children: currentNode.children.map(updateNode),
            };
          }
          return currentNode;
        };

        setTreeData((prevData) => prevData && updateNode(prevData));
      }
    },
    [cursor, fetchNodeData, setImage, setTreeData]
  );

  const renderStatusIcon = useCallback((status: ImageStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Minus
            size={12}
            className="shrink-0 stroke-gray-400"
          />
        );
      case 'IN_PROGRESS':
        return (
          <Loader
            size={12}
            className="shrink-0 animate-spin stroke-yellow-400"
          />
        );
      case 'SAVE':
        return (
          <ArrowDownToLine
            size={12}
            className="shrink-0 stroke-gray-400"
          />
        );
      case 'REVIEW_REQUEST':
        return (
          <Send
            size={12}
            className="shrink-0 stroke-blue-400"
          />
        );
      case 'REVIEW_REJECT':
        return (
          <CircleSlash
            size={12}
            className="shrink-0 stroke-red-400"
          />
        );
      case 'COMPLETED':
      default:
        return (
          <Check
            size={12}
            className="shrink-0 stroke-green-400"
          />
        );
    }
  }, []);

  const flattenTree = useCallback((nodes: TreeNode[], depth: number = 0, parent?: FlatNode): FlatNode[] => {
    let flatList: FlatNode[] = [];

    nodes.forEach((node, index) => {
      const flatNode: FlatNode = {
        ...node,
        depth,
        isLeaf: !node.children || node.children.length === 0,
        parent,
        index,
      };
      flatList.push(flatNode);

      if (node.toggled && node.children) {
        flatList = flatList.concat(flattenTree(node.children, depth + 1, flatNode));
      }
    });

    return flatList;
  }, []);

  const flatData = useMemo(() => {
    if (!treeData) return [];
    return flattenTree([treeData]);
  }, [treeData, flattenTree]);

  const getItemKey = (index: number, data: FlatNode[]) => data[index].id!;

  const moveNode = useCallback(
    (dragItem: FlatNode, hoverItem: FlatNode) => {
      const updatedTreeData = (function moveNodeInTree(node: TreeNode): TreeNode {
        if (node.id === dragItem.parent?.id) {
          const newChildren = node.children?.filter((child) => child.id !== dragItem.id) || [];
          return { ...node, children: newChildren };
        }

        if (node.id === hoverItem.parent?.id) {
          const newChildren = [...(node.children || [])];
          const hoverIndex = newChildren.findIndex((child) => child.id === hoverItem.id);
          newChildren.splice(hoverIndex, 0, { ...dragItem, parent: hoverItem.parent } as FlatNode);
          return { ...node, children: newChildren };
        }

        if (node.children) {
          return {
            ...node,
            children: node.children.map(moveNodeInTree),
          };
        }

        return node;
      })(treeData!);

      setTreeData(updatedTreeData);

      if (dragItem.imageData) {
        const moveFolderId = Number(hoverItem.parent?.id) || 0;
        const folderId = Number(dragItem.parent?.id) || 0;
        const projectId = Number(project.id);

        moveImageMutation.mutate({
          projectId,
          folderId,
          imageId: dragItem.imageData.id,
          moveRequest: {
            moveFolderId,
          },
        });
      }
    },
    [treeData, setTreeData, moveImageMutation, project.id]
  );

  const Row = ({ index, style, data }: ListChildComponentProps<FlatNode[]>) => {
    const node = data[index];
    const ref = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
      accept: ItemTypes.NODE,
      drop(item: FlatNode) {
        const dragItem = item;
        const hoverItem = node;

        if (dragItem.id === hoverItem.id) {
          return;
        }

        // 드래그가 끝났을 때 노드 이동 처리
        moveNode(dragItem, hoverItem);
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.NODE,
      item: () => ({ ...node, index }),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(drop(ref));

    return (
      <div
        ref={ref}
        style={{
          ...style,
          opacity: isDragging ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: `${node.depth * 20}px`,
          cursor: 'pointer',
        }}
        onClick={() => onToggle(node, !node.toggled)}
      >
        <div style={{ marginRight: '5px' }}>
          {!node.imageData ? (
            <Folder
              size={16}
              className="stroke-gray-500"
            />
          ) : (
            <ImageIcon
              size={16}
              className="stroke-gray-500"
            />
          )}
        </div>
        <span style={{ color: '#4a4a4a', flexGrow: 1 }}>{node.name}</span>
        {node.imageData && <div style={{ marginLeft: '10px' }}>{renderStatusIcon(node.imageData.status)}</div>}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="box-border flex h-full min-h-0 flex-col bg-gray-50 p-2"
        style={{ overflowX: 'hidden' }}
        ref={containerRef}
      >
        <div className="flex h-full flex-col gap-2 overflow-hidden px-1 pb-2">
          <header className="flex w-full items-center gap-2 rounded-md bg-white p-2 shadow-sm">
            <div className="flex w-full min-w-0 items-center gap-1 pr-1">
              <h2 className="caption overflow-hidden text-ellipsis whitespace-nowrap text-gray-600">{project.type}</h2>
            </div>
            <WorkspaceDropdownMenu
              projectId={project.id}
              folderId={0}
              onRefetch={() => {}}
            />
          </header>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          ) : !treeData ? (
            <div className="body-small flex h-full select-none items-center justify-center text-gray-400">
              Loading...
            </div>
          ) : (
            <List
              height={Math.min(flatData.length * 40, containerHeight)}
              itemCount={flatData.length}
              itemSize={40}
              width={'100%'}
              itemData={flatData}
              itemKey={getItemKey}
              className="flex-1 overflow-auto"
              style={{ overflowX: 'hidden' }}
            >
              {Row}
            </List>
          )}
        </div>
        <div className="flex">
          <AutoLabelButton projectId={project.id} />
        </div>
      </div>
    </DndProvider>
  );
}
