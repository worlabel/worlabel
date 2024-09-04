import { Label } from '@/types';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Line, Transformer } from 'react-konva';

export default function LabelRect({
  isSelected,
  onSelect,
  info,
  dragLayer,
}: {
  isSelected: boolean;
  onSelect: (evt: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => void;
  info: Label;
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
    const rectPoints = rectRef.current?.points();
    const points = [
      [rectPoints![0], rectPoints![1]],
      [rectPoints![4], rectPoints![5]],
    ];

    console.log(points);
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
