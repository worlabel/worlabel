import { Label } from '@/types';
import Konva from 'konva';
import { useRef, useState } from 'react';
import { Group, Line } from 'react-konva';
import PolygonTransformer from './PolygonTransformer';

export default function LabelPolygon({
  isSelected,
  onSelect,
  info,
  stage,
}: {
  isSelected: boolean;
  onSelect: () => void;
  info: Label;
  stage: Konva.Stage;
}) {
  const polyRef = useRef<Konva.Line>(null);
  const [coordinates, setCoordinates] = useState<Array<[number, number]>>(info.coordinates);

  return (
    <Group zIndex={isSelected ? 2 : 1}>
      <Line
        points={coordinates.flat()}
        stroke={info.color}
        strokeWidth={1}
        ref={polyRef}
        onMouseDown={onSelect}
        onTouchStart={onSelect}
        strokeScaleEnabled={false}
        fillAfterStrokeEnabled={false}
        fill={`${info.color}33`}
        closed
      />
      {isSelected && (
        <PolygonTransformer
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          stage={stage}
        />
      )}
    </Group>
  );
}
