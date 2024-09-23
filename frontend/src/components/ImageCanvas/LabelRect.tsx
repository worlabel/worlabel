import { Label } from '@/types';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Line, Transformer } from 'react-konva';

export default function LabelRect({
  isSelected,
  onSelect,
  info,
  setLabel,
  dragLayer,
}: {
  isSelected: boolean;
  onSelect: (evt: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => void;
  info: Label;
  setLabel: (coordinate: [number, number][]) => void;
  dragLayer: Konva.Layer;
}) {
  const rectRef = useRef<Konva.Line>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const coordinates = [
    info.coordinates[0],
    [info.coordinates[0][0], info.coordinates[1][1]],
    info.coordinates[1],
    [info.coordinates[1][0], info.coordinates[0][1]],
  ].flat();
  const handleSelect = (evt: Konva.KonvaEventObject<TouchEvent | MouseEvent>): void => {
    onSelect(evt);
    rectRef.current?.moveToTop();
    trRef.current?.moveToTop();
  };
  const handleMoveEnd = () => {
    const rect = rectRef.current?.getPosition();
    const scale = rectRef.current?.scale();

    if (!rect || !scale) return;

    const points: [number, number][] = [
      [info.coordinates[0][0] * scale.x + rect.x, info.coordinates[0][1] * scale.y + rect.y],
      [info.coordinates[1][0] * scale.x + rect.x, info.coordinates[1][1] * scale.y + rect.y],
    ];

    setLabel(points);
    rectRef.current?.setPosition({ x: 0, y: 0 });
    rectRef.current?.scale({ x: 1, y: 1 });
  };

  useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([rectRef.current as Konva.Node]);
      trRef.current?.moveTo(dragLayer);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [dragLayer, isSelected]);

  return (
    <>
      <Line
        points={coordinates}
        stroke={info.color}
        strokeWidth={1}
        ref={rectRef}
        onMouseDown={handleSelect}
        onTouchStart={handleSelect}
        strokeScaleEnabled={false}
        fillAfterStrokeEnabled={false}
        fill={`${info.color}33`}
        onDragEnd={handleMoveEnd}
        shadowForStrokeEnabled={false}
        closed
        draggable
      />
      {isSelected && (
        <Transformer
          keepRatio={false}
          ref={trRef}
          rotateEnabled={false}
          anchorSize={8}
          rotateAnchorCursor="pointer"
          rotateAnchorOffset={20}
          ignoreStroke={true}
          flipEnabled={false}
          onTransformEnd={handleMoveEnd}
        />
      )}
    </>
  );
}
