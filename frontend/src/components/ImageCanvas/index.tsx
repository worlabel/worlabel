import useCanvasStore from '@/stores/useCanvasStore';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Image, Layer, Stage } from 'react-konva';
import useImage from 'use-image';
import { Label } from '@/types';
import LabelRect from './LabelRect';
import { Vector2d } from 'konva/lib/types';

const mockLabels: Label[] = [
  {
    id: 1,
    name: 'Label 1',
    color: '#FFaa33',
    type: 'rect',
    coordinates: [
      [100, 100],
      [200, 100],
      [200, 200],
      [100, 200],
    ],
  },
  {
    id: 2,
    name: 'Label 3',
    color: '#aa33ff',
    type: 'rect',
    coordinates: [
      [1200, 200],
      [1200, 400],
      [1400, 400],
      [1400, 200],
    ],
  },
  {
    id: 3,
    name: 'Label 3',
    color: '#aaff33',
    type: 'polygon',
    // star shape
    coordinates: [
      [500, 375],
      [523, 232],
      [600, 232],
      [535, 175],
      [560, 100],
      [500, 150],
      [440, 100],
      [465, 175],
      [400, 232],
      [477, 232],
    ],
  },
];

export default function ImageCanvas() {
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight;
  const stageRef = useRef<Konva.Stage>(null);
  const scale = useRef<number>(0);
  const imageUrl = '/sample.jpg';
  const labels = useCanvasStore((state) => state.labels) ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [image, imageStatus] = useImage(imageUrl);
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

    console.log(scale);

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
      scale={getScale()}
    >
      <Layer>
        <Image image={image} />
      </Layer>
      {labels.map((label) => (
        <Layer key={label.id}>
          {label.type === 'rect' ? (
            <LabelRect
              isSelected={label.id === selectedId}
              onSelect={() => setSelectedId(label.id)}
              info={label}
            />
          ) : (
            <></>
          )}
        </Layer>
      ))}
    </Stage>
  ) : (
    <div></div>
  );
}
