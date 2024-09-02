import { Label } from '@/types';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Line } from 'react-konva';

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

  useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([rectRef.current as Konva.Node]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
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
  );
}
