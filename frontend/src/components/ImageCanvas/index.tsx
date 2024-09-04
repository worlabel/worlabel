import useCanvasStore from '@/stores/useCanvasStore';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Image, Layer, Stage } from 'react-konva';
import useImage from 'use-image';
import { Label } from '@/types';
import LabelRect from './LabelRect';
import { Vector2d } from 'konva/lib/types';
import LabelPolygon from './LabelPolygon';

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
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage() || e.target.getClassName() === 'Image') {
      setSelectedId(null);
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

  return imageStatus === 'loaded' ? (
    <Stage
      ref={stageRef}
      width={stageWidth}
      height={stageHeight}
      className="overflow-hidden bg-gray-200"
      draggable
      onWheel={handleWheel}
      onMouseDown={handleClick}
      onTouchStart={handleClick}
      scale={getScale()}
    >
      <Layer>
        <Image image={image} />
      </Layer>
      <Layer>
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
      </Layer>
      <Layer ref={dragLayerRef} />
    </Stage>
  ) : (
    <div></div>
  );
}
