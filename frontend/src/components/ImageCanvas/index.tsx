import useCanvasStore from '@/stores/useCanvasStore';
import useCommentStore from '@/stores/useCommentStore';
import useCommentListQuery from '@/queries/comments/useCommentListQuery';
import useCreateCommentQuery from '@/queries/comments/useCreateCommentQuery';
import useUpdateCommentQuery from '@/queries/comments/useUpdateCommentQuery';
import useDeleteCommentQuery from '@/queries/comments/useDeleteCommentQuery';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Circle, Image, Layer, Line, Rect, Stage } from 'react-konva';
import useImage from 'use-image';
import LabelRect from './LabelRect';
import { Vector2d } from 'konva/lib/types';
import LabelPolygon from './LabelPolygon';
import CanvasControlBar from '../CanvasControlBar';
import { Label } from '@/types';
import useLabelJson from '@/hooks/useLabelJson';
import useProjectStore from '@/stores/useProjectStore';
import { useQueryClient } from '@tanstack/react-query';
import useSaveImageLabelsQuery from '@/queries/projects/useSaveImageLabelsQuery';
import { useToast } from '@/hooks/use-toast';
import CommentLabel from './CommentLabel';
import rectSort from '@/utils/rectSort';

export default function ImageCanvas() {
  const { project, folderId, categories } = useProjectStore();
  const { id: imageId, imagePath, dataPath } = useCanvasStore((state) => state.image)!;
  const { data: labelData } = useLabelJson(dataPath, project!);
  const { labels, drawState, setDrawState, addLabel, setLabels, selectedLabelId, setSelectedLabelId, sidebarSize } =
    useCanvasStore();
  const { shapes } = labelData || [];
  const stageWidth = window.innerWidth * ((100 - sidebarSize) / 100) - 201;
  const stageHeight = window.innerHeight - 64;
  const stageRef = useRef<Konva.Stage>(null);
  const dragLayerRef = useRef<Konva.Layer>(null);
  const scale = useRef<number>(0);
  const [image] = useImage(imagePath);
  const [rectPoints, setRectPoints] = useState<[number, number][]>([]);
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);
  const saveImageLabelsMutation = useSaveImageLabelsQuery();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { comments, setComments } = useCommentStore();
  const { data: commentList } = useCommentListQuery(project!.id, imageId);
  const createCommentMutation = useCreateCommentQuery(project!.id, imageId);
  const updateCommentMutation = useUpdateCommentQuery(project!.id);
  const deleteCommentMutation = useDeleteCommentQuery(project!.id);

  useEffect(() => {
    setLabels(
      shapes.map<Label>(({ group_id, color, points, shape_type }, index) => ({
        id: index,
        categoryId: group_id,
        color,
        type: shape_type,
        coordinates: points,
      }))
    );
  }, [setLabels, shapes]);

  useEffect(() => {
    setSelectedLabelId(null);
  }, [image, setSelectedLabelId]);

  useEffect(() => {
    if (commentList) {
      setComments(
        commentList.map((comment) => ({
          ...comment,
          isOpen: false,
        }))
      );
    }
  }, [commentList, setComments]);

  const setLabel = (index: number) => (coordinates: [number, number][]) => {
    const newLabels = [...labels];
    newLabels[index].coordinates = coordinates;
    setLabels(newLabels);
  };

  const saveJson = () => {
    const json = JSON.stringify({
      ...labelData,
      shapes: labels.map(({ categoryId, color, coordinates, type }) => ({
        label: categories.find((category) => category.id === categoryId)!.labelName,
        color,
        points: coordinates,
        group_id: categoryId,
        shape_type: type === 'polygon' ? 'polygon' : 'rectangle',
        flags: {},
      })),
      imageWidth: image!.width,
      imageHeight: image!.height,
    });

    saveImageLabelsMutation.mutate(
      { projectId: project!.id, imageId: imageId, data: { data: json } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['folder', project!.id.toString(), folderId] });
          toast({
            title: '저장 성공',
            duration: 1500,
          });
        },
        onError: () => {
          toast({
            title: '저장 실패',
            duration: 1500,
          });
        },
      }
    );
  };

  const startDrawRect = () => {
    const { x, y } = stageRef.current!.getRelativePointerPosition()!;
    setRectPoints([
      [x, y],
      [x, y],
    ]);
  };

  const addPointToPolygon = () => {
    const { x, y } = stageRef.current!.getRelativePointerPosition()!;
    if (polygonPoints.length === 0) {
      setPolygonPoints([
        [x, y],
        [x, y],
      ]);
      return;
    }

    const diff = Math.max(Math.abs(x - polygonPoints[0][0]), Math.abs(y - polygonPoints[0][1]));

    if (diff === 0) return;

    const scale = stageRef.current!.getAbsoluteScale().x;
    const clickedFirstPoint = polygonPoints.length > 1 && diff * scale < 5;

    if (clickedFirstPoint) {
      endDrawPolygon();
      return;
    }
    setPolygonPoints([...polygonPoints, [x, y]]);
  };

  const removeLastPointOfPolygon = (e: MouseEvent) => {
    e.preventDefault();
    if (polygonPoints.length === 0) return;
    setPolygonPoints(polygonPoints.slice(0, -1));
  };

  const moveLastPointOfPolygon = () => {
    if (polygonPoints.length < 2) return;
    const { x, y } = stageRef.current!.getRelativePointerPosition()!;
    setPolygonPoints([...polygonPoints.slice(0, -1), [x, y]]);
  };

  const endDrawPolygon = () => {
    if (drawState !== 'pen' || polygonPoints.length === 0) return;
    setDrawState('pointer');
    setPolygonPoints([]);

    if (polygonPoints.length < 4) return;

    const color = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');
    const id = labels.length;
    addLabel({
      id: id,
      categoryId: categories[0]!.id,
      type: 'polygon',
      color: `#${color}`,
      coordinates: polygonPoints.slice(0, -1),
    });
    setDrawState('pointer');
    setSelectedLabelId(id);
  };

  const updateDrawingRect = () => {
    if (rectPoints.length === 0) return;

    const { x, y } = stageRef.current!.getRelativePointerPosition()!;
    setRectPoints([rectPoints[0], [x, y]]);
  };

  const endDrawRect = () => {
    if (drawState !== 'rect' || rectPoints.length === 0) return;
    setRectPoints([]);
    if (rectPoints[0][0] === rectPoints[1][0] && rectPoints[0][1] === rectPoints[1][1]) {
      return;
    }
    const sortedPoints = rectSort(rectPoints as [[number, number], [number, number]]);

    const color = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');
    const id = labels.length;
    addLabel({
      id: id,
      categoryId: categories[0]!.id,
      type: 'rectangle',
      color: `#${color}`,
      coordinates: sortedPoints,
    });
    setDrawState('pointer');
    setSelectedLabelId(id);
  };
  const addComment = () => {
    const { x, y } = stageRef.current!.getRelativePointerPosition()!;

    createCommentMutation.mutate({
      content: '',
      positionX: x,
      positionY: y,
    });
    setDrawState('pointer');
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.evt.preventDefault();
    e.evt.stopPropagation();
    const isLeftClicked = e.evt.type === 'mousedown' && (e.evt as MouseEvent).button === 0;
    const isRightClicked = e.evt.type === 'mousedown' && (e.evt as MouseEvent).button === 2;

    if (drawState === 'comment' && isLeftClicked) {
      addComment();
    }

    if (drawState !== 'pointer' && (isLeftClicked || isRightClicked)) {
      stageRef.current?.stopDrag();
      if (drawState === 'rect') {
        startDrawRect();
      }
      if (drawState === 'pen') {
        isRightClicked ? removeLastPointOfPolygon(e.evt as MouseEvent) : addPointToPolygon();
      }
      return;
    }
    if (selectedLabelId === null) return;
    if (e.target === e.target.getStage() || e.target.getClassName() === 'Image') {
      setSelectedLabelId(null);
    }
  };

  const handleMouseMove = () => {
    if (drawState === 'rect' && rectPoints.length) {
      updateDrawingRect();
    }
    if (drawState === 'pen' && polygonPoints.length) {
      moveLastPointOfPolygon();
    }
  };

  const handleZoom = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const scaleBy = 1.05;
    const oldScale = scale.current;
    const mousePointTo = {
      x: (stageRef.current?.getPointerPosition()?.x ?? 0) / oldScale - stageRef.current!.x() / oldScale,
      y: (stageRef.current?.getPointerPosition()?.y ?? 0) / oldScale - stageRef.current!.y() / oldScale,
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    scale.current = newScale;

    stageRef.current?.scale({ x: newScale, y: newScale });
    const newPos = {
      x: -(mousePointTo.x - (stageRef.current?.getPointerPosition()?.x ?? 0) / newScale) * newScale,
      y: -(mousePointTo.y - (stageRef.current?.getPointerPosition()?.y ?? 0) / newScale) * newScale,
    };
    stageRef.current?.position(newPos);
    stageRef.current?.batchDraw();
  };

  const handleScroll = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const delta = -e.evt.deltaY;
    const x = stageRef.current?.x();
    const y = stageRef.current?.y();
    const newX = e.evt.shiftKey ? x! + delta : x!;
    const newY = e.evt.shiftKey ? y! : y! + delta;
    stageRef.current?.position({ x: newX, y: newY });
    stageRef.current?.batchDraw();
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    if (stageRef.current === null) return;
    e.evt.preventDefault();

    e.evt.ctrlKey ? handleZoom(e) : handleScroll(e);
  };

  const getScale = (): Vector2d => {
    if (scale.current) return { x: scale.current, y: scale.current };
    const widthRatio = stageWidth / image!.width;
    const heightRatio = stageHeight / image!.height;
    scale.current = Math.min(widthRatio, heightRatio);

    return { x: scale.current, y: scale.current };
  };

  useEffect(() => {
    if (!image) {
      scale.current = 0;
      return;
    }
    const widthRatio = stageWidth / image!.width;
    const heightRatio = stageHeight / image!.height;

    scale.current = Math.min(widthRatio, heightRatio);
  }, [image, stageHeight, stageWidth]);

  useEffect(() => {
    if (!stageRef.current) return;
    stageRef.current.container().style.cursor = drawState === 'pointer' ? 'default' : 'crosshair';

    if (drawState !== 'pointer') {
      setSelectedLabelId(null);
    }
  }, [drawState, setSelectedLabelId]);

  return image ? (
    <div>
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        className="overflow-hidden bg-gray-200"
        draggable={drawState !== 'comment'}
        onWheel={handleWheel}
        onMouseDown={handleClick}
        onTouchStart={handleClick}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={endDrawRect}
        onTouchEnd={endDrawRect}
        scale={getScale()}
        onContextMenu={(e) => e.evt.preventDefault()}
      >
        <Layer>
          <Image image={image} />
        </Layer>

        {project?.type !== 'classification' && (
          <Layer listening={drawState === 'pointer'}>
            {labels.map((label) =>
              label.type === 'rectangle' ? (
                <LabelRect
                  key={label.id}
                  isSelected={label.id === selectedLabelId}
                  onSelect={() => setSelectedLabelId(label.id)}
                  info={label}
                  setLabel={setLabel(label.id)}
                  dragLayer={dragLayerRef.current as Konva.Layer}
                />
              ) : (
                <LabelPolygon
                  key={label.id}
                  isSelected={label.id === selectedLabelId}
                  onSelect={() => setSelectedLabelId(label.id)}
                  info={label}
                  setLabel={setLabel(label.id)}
                  stage={stageRef.current as Konva.Stage}
                  dragLayer={dragLayerRef.current as Konva.Layer}
                />
              )
            )}
            {rectPoints.length ? (
              <Rect
                x={rectPoints[0][0]}
                y={rectPoints[0][1]}
                width={rectPoints[1][0] - rectPoints[0][0]}
                height={rectPoints[1][1] - rectPoints[0][1]}
                stroke={'#00a1ff'}
                strokeWidth={1}
                strokeScaleEnabled={false}
                fillAfterStrokeEnabled={false}
                fill="#00a1ff33"
                shadowForStrokeEnabled={false}
                listening={false}
              />
            ) : null}
            {polygonPoints.length ? (
              <>
                <Line
                  points={polygonPoints.flat()}
                  stroke={'#00a1ff'}
                  strokeWidth={1}
                  strokeScaleEnabled={false}
                  listening={false}
                />
                {polygonPoints.map((point, index) => (
                  <Circle
                    key={index}
                    x={point[0]}
                    y={point[1]}
                    radius={5}
                    stroke="#00a1ff"
                    strokeWidth={1}
                    fill="white"
                    strokeScaleEnabled={false}
                    listening={false}
                    scale={{
                      x: 1 / stageRef.current!.getAbsoluteScale().x,
                      y: 1 / stageRef.current!.getAbsoluteScale().y,
                    }}
                    perfectDrawEnabled={false}
                    shadowForStrokeEnabled={false}
                  />
                ))}
              </>
            ) : null}
          </Layer>
        )}

        <Layer>
          {comments.map((comment) => (
            <CommentLabel
              key={comment.id}
              stage={stageRef.current as Konva.Stage}
              comment={comment}
              updateComment={(updatedComment) => {
                updateCommentMutation.mutate({
                  commentId: comment.id,
                  commentData: {
                    content: updatedComment.content,
                    positionX: updatedComment.positionX,
                    positionY: updatedComment.positionY,
                  },
                });
              }}
              deleteComment={(commentId) => {
                deleteCommentMutation.mutate(commentId);
              }}
              toggleComment={(commentId) => {
                useCommentStore.getState().toggleComment(commentId);
              }}
            />
          ))}
        </Layer>
        <Layer ref={dragLayerRef} />
      </Stage>
      <CanvasControlBar
        saveJson={saveJson}
        projectType={project!.type}
        categories={categories}
      />
    </div>
  ) : (
    <div></div>
  );
}
