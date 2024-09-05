import useCanvasStore from '@/stores/useCanvasStore';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Image, Layer, Rect, Stage } from 'react-konva';
import useImage from 'use-image';
import { Label } from '@/types';
import LabelRect from './LabelRect';
import { Vector2d } from 'konva/lib/types';
import LabelPolygon from './LabelPolygon';
import CanvasControlBar from '../CanvasControlBar';

const mockLabels: Label[] = Array.from({ length: 10 }, (_, i) => {
  const startX = Math.random() * 1200 + 300;
  const startY = Math.random() * 2000 + 300;
  const color = Math.floor(Math.random() * 65535)
    .toString(16)
    .padStart(4, '0');

  return {
    id: i,
    name: `label-${i}`,
    type: i % 2 === 0 ? 'polygon' : 'rect',
    color: i % 2 === 0 ? `#ff${color}` : `#${color}ff`,
    coordinates:
      i % 2 === 0
        ? [
            [startX, startY],
            [startX + 200, startY + 50],
            [startX + 300, startY + 300],
            [startX + 100, startY + 250],
          ]
        : [
            [startX, startY],
            [startX + 300, startY + 300],
          ],
  };
});

export default function ImageCanvas() {
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight;
  const stageRef = useRef<Konva.Stage>(null);
  const dragLayerRef = useRef<Konva.Layer>(null);
  const scale = useRef<number>(0);
  const imageUrl = '/sample.jpg';
  const labels = useCanvasStore((state) => state.labels) ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [image, imageStatus] = useImage(imageUrl);
  const [rectPoints, setRectPoints] = useState<[number, number][]>([]);
  const drawState = useCanvasStore((state) => state.drawState);
  const addLabel = useCanvasStore((state) => state.addLabel);
  const startDrawRect = () => {
    const { x, y } = stageRef.current!.getRelativePointerPosition()!;
    setRectPoints([
      [x, y],
      [x, y],
    ]);
  };
  const updateDrawingRect = () => {
    if (rectPoints.length === 0) return;

    const { x, y } = stageRef.current!.getRelativePointerPosition()!;
    setRectPoints([rectPoints[0], [x, y]]);
  };
  const endDrawRect = () => {
    if (drawState !== 'rect' || rectPoints.length === 0) return;
    if (rectPoints[0][0] === rectPoints[1][0] && rectPoints[0][1] === rectPoints[1][1]) {
      setRectPoints([]);
      return;
    }
    setRectPoints([]);
    const color = Math.floor(Math.random() * 65535)
      .toString(16)
      .padStart(4, '0');
    addLabel({
      id: labels.length,
      name: 'label',
      type: 'rect',
      color: `#${color}ff`,
      coordinates: rectPoints,
    });
  };
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const isLeftMouseClicked = e.evt.type === 'mousedown' && (e.evt as MouseEvent).button === 0;

    if (drawState !== 'pointer' && isLeftMouseClicked) {
      stageRef.current?.stopDrag();
      if (drawState === 'rect') {
        startDrawRect();
      }
      return;
    }
    if (e.target === e.target.getStage() || e.target.getClassName() === 'Image') {
      setSelectedId(null);
    }
  };
  const handleMouseMove = () => {
    if (drawState === 'rect' && rectPoints.length) {
      updateDrawingRect();
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

  // TODO: remove mock data
  useEffect(() => {
    useCanvasStore.setState({ labels: mockLabels });
  }, []);

  useEffect(() => {
    if (!stageRef.current) return;
    stageRef.current.container().style.cursor = drawState === 'pointer' ? 'default' : 'crosshair';

    if (drawState !== 'pointer') {
      setSelectedId(null);
    }
  }, [drawState]);

  return imageStatus === 'loaded' ? (
    <div>
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        className="overflow-hidden bg-gray-200"
        draggable
        onWheel={handleWheel}
        onMouseDown={handleClick}
        onTouchStart={handleClick}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={endDrawRect}
        onTouchEnd={endDrawRect}
        scale={getScale()}
      >
        <Layer>
          <Image image={image} />
        </Layer>
        <Layer listening={drawState === 'pointer'}>
          {labels.map((label) =>
            label.type === 'rect' ? (
              <LabelRect
                key={label.id}
                isSelected={label.id === selectedId}
                onSelect={() => setSelectedId(label.id)}
                info={label}
                dragLayer={dragLayerRef.current as Konva.Layer}
              />
            ) : (
              <LabelPolygon
                key={label.id}
                isSelected={label.id === selectedId}
                onSelect={() => setSelectedId(label.id)}
                info={label}
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
              stroke={'#ff0000'}
              strokeWidth={1}
              strokeScaleEnabled={false}
              fillAfterStrokeEnabled={false}
              fill="#ff000033"
              shadowForStrokeEnabled={false}
              listening={false}
            />
          ) : null}
        </Layer>

        <Layer ref={dragLayerRef} />
      </Stage>
      <CanvasControlBar />
    </div>
  ) : (
    <div></div>
  );
}
