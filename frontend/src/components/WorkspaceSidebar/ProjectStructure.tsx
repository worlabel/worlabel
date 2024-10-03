import { useEffect, useState, useCallback } from 'react';
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
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

export default function ProjectStructure({ project }: { project: Project }) {
  const { setProject } = useProjectStore();
  const { setImage } = useCanvasStore();
  const { treeData, fetchNodeData, initializeTree, setTreeData, isLoading } = useTreeData(project.id.toString(), 0);
  const [cursor, setCursor] = useState<TreeNode | null>(null);
  const moveImageMutation = useMoveImageQuery();

  useEffect(() => {
    setProject(project);
    initializeTree();
  }, [project, setProject, initializeTree]);

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
        node.toggled = toggled;
      }

      setTreeData((prevData) => ({ ...prevData! }));
    },
    [cursor, fetchNodeData, setImage, setTreeData]
  );

  const renderStatusIcon = (status: ImageStatus) => {
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
  };

  const renderTree = useCallback(
    (nodes: TreeNode[], _parentId: string, level: number = 0) => {
      return nodes.map((node, index) => (
        <Draggable
          draggableId={node.id!}
          index={index}
          key={node.id}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              style={{
                ...provided.draggableProps.style,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                {...provided.dragHandleProps}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: `${level * 20}px`,
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
              {node.toggled && node.children && node.children.length > 0 && (
                <Droppable
                  droppableId={node.id!}
                  type="TREE"
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ paddingLeft: `${level * 20}px` }}
                    >
                      {renderTree(node.children!, node.id!, level + 1)}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          )}
        </Draggable>
      ));
    },
    [onToggle]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || !treeData) {
        return;
      }

      const sourceDroppableId = result.source.droppableId;
      const destinationDroppableId = result.destination.droppableId;
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;

      const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
        for (const node of nodes) {
          if (node.id === id) {
            return node;
          }
          if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const sourceParentNode = sourceDroppableId === 'root' ? treeData : findNodeById([treeData], sourceDroppableId);
      const destinationParentNode =
        destinationDroppableId === 'root' ? treeData : findNodeById([treeData], destinationDroppableId);

      if (!sourceParentNode || !destinationParentNode) {
        return;
      }

      const [movedItem] = sourceParentNode.children!.splice(sourceIndex, 1);

      destinationParentNode.children!.splice(destinationIndex, 0, movedItem);

      setTreeData({ ...treeData });

      if (movedItem && movedItem.imageData) {
        const moveFolderId = Number(destinationParentNode.id) || 0;
        const folderId = Number(sourceParentNode.id) || 0;
        const projectId = Number(project.id);

        moveImageMutation.mutate({
          projectId,
          folderId,
          imageId: movedItem.imageData.id,
          moveRequest: {
            moveFolderId,
          },
        });
      }
    },
    [treeData, setTreeData, moveImageMutation, project.id]
  );

  return (
    <div className="box-border flex h-full min-h-0 flex-col bg-gray-50 p-2">
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
          <div className="body-small flex h-full select-none items-center justify-center text-gray-400">Loading...</div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="root"
              type="TREE"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 overflow-auto"
                  style={{ overflowX: 'hidden' }}
                >
                  {renderTree(treeData.children!, 'root')}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
      <div className="flex">
        <AutoLabelButton projectId={project.id} />
      </div>
    </div>
  );
}
