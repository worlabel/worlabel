import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TreeNode } from 'react-treebeard';
import useProjectStore from '@/stores/useProjectStore';
import useCanvasStore from '@/stores/useCanvasStore';
import useTreeData from '@/hooks/useTreeData';
import useProjectCategoriesQuery from '@/queries/category/useProjectCategoriesQuery';
import useMoveImageQuery from '@/queries/images/useMoveImageQuery';
import { Project, ImageResponse } from '@/types';
import WorkspaceDropdownMenu from '../WorkspaceDropdownMenu';
import AutoLabelButton from './AutoLabelButton';
import { Folder, Image as ImageIcon, Minus, Loader, ArrowDownToLine, Send, CircleSlash, Check } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { ImageStatus } from '@/types';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useFolderQuery from '@/queries/folders/useFolderQuery';

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
  const { setProject, setCategories, setFolderId } = useProjectStore();
  const { image: selectedImage, setImage } = useCanvasStore();
  const { treeData, fetchNodeData, setTreeData } = useTreeData(project.id.toString());
  const { data: categories } = useProjectCategoriesQuery(project.id);
  const { isLoading, refetch } = useFolderQuery(project.id.toString(), 0);

  const moveImageMutation = useMoveImageQuery();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(400);

  useEffect(() => {
    if (categories) {
      setCategories(categories);
    }
  }, [categories, setCategories]);

  useEffect(() => {
    setProject(project);
  }, [project, setProject]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, [treeData, isLoading]);

  const onToggle = useCallback(
    async (node: TreeNode, toggled: boolean) => {
      if (!node.imageData) {
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
    [fetchNodeData, setTreeData]
  );

  const handleImageClick = useCallback(
    (image: ImageResponse, parent?: FlatNode) => {
      setImage(image);
      if (parent) {
        setFolderId(Number(parent.id)); // 클릭된 이미지의 상위 폴더 ID 설정
      }
    },
    [setImage, setFolderId]
  );

  const renderStatusIcon = (status: ImageStatus) => {
    const iconProps = { size: 12, className: 'shrink-0' };
    const iconColor = {
      PENDING: 'stroke-gray-400',
      IN_PROGRESS: 'animate-spin stroke-yellow-400',
      SAVE: 'stroke-gray-400',
      REVIEW_REQUEST: 'stroke-blue-400',
      REVIEW_REJECT: 'stroke-red-400',
      COMPLETED: 'stroke-green-400',
    };

    const iconMapping = {
      PENDING: (
        <Minus
          {...iconProps}
          className={`${iconProps.className} ${iconColor.PENDING}`}
        />
      ),
      IN_PROGRESS: (
        <Loader
          {...iconProps}
          className={`${iconProps.className} ${iconColor.IN_PROGRESS}`}
        />
      ),
      SAVE: (
        <ArrowDownToLine
          {...iconProps}
          className={`${iconProps.className} ${iconColor.SAVE}`}
        />
      ),
      REVIEW_REQUEST: (
        <Send
          {...iconProps}
          className={`${iconProps.className} ${iconColor.REVIEW_REQUEST}`}
        />
      ),
      REVIEW_REJECT: (
        <CircleSlash
          {...iconProps}
          className={`${iconProps.className} ${iconColor.REVIEW_REJECT}`}
        />
      ),
      COMPLETED: (
        <Check
          {...iconProps}
          className={`${iconProps.className} ${iconColor.COMPLETED}`}
        />
      ),
    };

    return iconMapping[status] || null;
  };

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
        moveImageMutation.mutate({
          projectId: project.id,
          folderId: Number(dragItem.parent?.id),
          imageId: dragItem.imageData.id,
          moveRequest: {
            moveFolderId: Number(hoverItem.parent?.id),
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
          backgroundColor: node.imageData && selectedImage?.id === node.imageData.id ? '#e5e7eb' : 'transparent',
        }}
        onClick={() => {
          if (node.imageData) {
            handleImageClick(node.imageData as ImageResponse, node.parent);
          } else {
            onToggle(node, !node.toggled);
          }
        }}
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
        {node.imageData && <div style={{ marginRight: '20px' }}>{renderStatusIcon(node.imageData.status)}</div>}
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
              onRefetch={refetch}
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
