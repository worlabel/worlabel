import { Label } from '@/types';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Line, Transformer } from 'react-konva';

export default function LabelRect({
  isSelected,
  onSelect,
  info,
}: {
  isSelected: boolean;
  onSelect: () => void;
  info: Label;
}) {
  const rectRef = useRef<Konva.Line>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const handleTransformEnd = () => {
    const points = rectRef.current?.points();
    if (points) {
      console.log(points);
      console.log(trRef.current?.getAbsoluteScale());
    }
  };

  useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([rectRef.current as Konva.Node]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Line
        points={info.coordinates.flat()}
        stroke={info.color}
        strokeWidth={1}
        ref={rectRef}
        onMouseDown={onSelect}
        onTouchStart={onSelect}
        strokeScaleEnabled={false}
        fillAfterStrokeEnabled={false}
        fill={`${info.color}33`}
        closed
        draggable
      />
      {isSelected && (
        <Transformer
          keepRatio={false}
          ref={trRef}
          rotateEnabled={false}
          anchorSize={4}
          rotateAnchorCursor="pointer"
          rotateAnchorOffset={20}
          ignoreStroke={true}
          flipEnabled={false}
          onTransformEnd={handleTransformEnd}
        />
      )}
    </>
  );
}
