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
import { Folder, Image as ImageIcon } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { useDrag, useDrop } from 'react-dnd';
import useFolderQuery from '@/queries/folders/useFolderQuery';
import MemoFileStatusIcon from './FileStatusIcon';
import moveNodeInTree from '@/utils/moveNodeInTree';
import ProjectContextMenu from './ProjectContextMenu';
import { useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';

interface FlatNode extends TreeNode {
  depth: number;
  isLeaf: boolean;
  parent?: FlatNode;
  index?: number;
}

const ItemTypes = {
  NODE: 'node',
};

const MENU_ID = 'project-menu';

export default function ProjectStructure({ project }: { project: Project }) {
  const { setProject, setCategories, setFolderId } = useProjectStore();
  const { image: selectedImage, setImage } = useCanvasStore();
  const { treeData, fetchNodeData, fetchContextFolderData, setTreeData } = useTreeData(project.id.toString());
  const { data: categories } = useProjectCategoriesQuery(project.id);
  const { isLoading, refetch } = useFolderQuery(project.id.toString(), 0);

  const moveImageMutation = useMoveImageQuery();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(400);

  const { show } = useContextMenu({ id: MENU_ID });
  const [contextNode, setContextNode] = useState<FlatNode | null>(null);

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
      if (node.imageData) return;
      if (toggled && (!node.children || node.children.length === 0)) {
        await fetchNodeData(node);
      }

      const updateNode = (currentNode: TreeNode): TreeNode => {
        if (currentNode.id === node.id) {
          return { ...currentNode, toggled };
        }
        return currentNode.children ? { ...currentNode, children: currentNode.children.map(updateNode) } : currentNode;
      };

      setTreeData((prevData) => prevData && updateNode(prevData));
    },
    [fetchNodeData, setTreeData]
  );

  const handleImageClick = useCallback(
    (image: ImageResponse, parent?: FlatNode) => {
      setImage(image);
      if (parent) {
        setFolderId(Number(parent.id));
      }
    },
    [setImage, setFolderId]
  );

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
      setTreeData(moveNodeInTree(treeData!, dragItem, hoverItem));

      if (!dragItem.imageData) return;

      moveImageMutation.mutate({
        projectId: project.id,
        folderId: Number(dragItem.parent?.id),
        imageId: dragItem.imageData.id,
        moveRequest: {
          moveFolderId: Number(hoverItem.parent?.id),
        },
      });
    },
    [treeData, setTreeData, moveImageMutation, project.id]
  );

  const handleContextMenu = (event: React.MouseEvent, node: FlatNode) => {
    event.preventDefault();
    setContextNode(node);
    const parentId = node.parent ? Number(node.parent.id) : null;
    fetchContextFolderData(parentId);
    show({ event });
  };

  const Row = ({ index, style, data }: ListChildComponentProps<FlatNode[]>) => {
    const node = data[index];
    const ref = useRef<HTMLButtonElement>(null);

    const [, drop] = useDrop({
      accept: ItemTypes.NODE,
      drop(item: FlatNode) {
        if (item.id === node.id) return;

        moveNode(item, node);
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
      <button
        ref={ref}
        style={{
          ...style,
          paddingLeft: `${node.depth * 12}px`,
        }}
        className={`caption flex w-full items-center gap-2 rounded-md py-0.5 pr-1 ${
          node.imageData && selectedImage?.id === node.imageData?.id ? 'bg-gray-200' : 'hover:bg-gray-100'
        } ${isDragging ? 'opacity-50' : ''}`}
        onClick={() => {
          if (node.imageData) {
            handleImageClick(node.imageData as ImageResponse, node.parent);
          } else {
            onToggle(node, !node.toggled);
          }
        }}
        onContextMenu={(event) => handleContextMenu(event, node)}
      >
        <div className="flex items-center">
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
        <span className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-900">
          {node.name}
        </span>
        {node.imageData && <MemoFileStatusIcon imageStatus={node.imageData.status} />}
      </button>
    );
  };

  return (
    <div
      className="box-border flex h-full min-h-0 flex-col overflow-x-hidden bg-gray-50"
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
        {isLoading || !treeData ? (
          <div className="flex h-full items-center justify-center">
            <Spinner
              show={true}
              size={'large'}
            />
          </div>
        ) : (
          <List
            height={Math.min(flatData.length * 20, containerHeight)}
            itemCount={flatData.length}
            itemSize={20}
            width={'100%'}
            itemData={flatData}
            itemKey={getItemKey}
            className="flex-1 overflow-x-hidden"
          >
            {Row}
          </List>
        )}
      </div>
      <div className="flex">
        <AutoLabelButton projectId={project.id} />
      </div>

      <ProjectContextMenu
        projectId={project.id}
        folderId={contextNode?.parent?.id ? Number(contextNode.parent.id) : 0}
        node={
          contextNode && contextNode.imageData
            ? { id: Number(contextNode.id), type: 'image', name: contextNode.name }
            : contextNode
              ? { id: Number(contextNode.id), type: 'folder', name: contextNode.name }
              : undefined
        }
        onRefetch={refetch}
      />
    </div>
  );
}
