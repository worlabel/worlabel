import { Label } from '@/types';
import Konva from 'konva';
import { useState } from 'react';
import { Line } from 'react-konva';
import PolygonTransformer from './PolygonTransformer';

export default function LabelPolygon({
  isSelected,
  onSelect,
  info,
  stage,
  dragLayer,
}: {
  isSelected: boolean;
  onSelect: () => void;
  info: Label;
  stage: Konva.Stage;
  dragLayer: Konva.Layer;
}) {
  const [coordinates, setCoordinates] = useState<Array<[number, number]>>(info.coordinates);

  return (
    <>
      <Line
        points={coordinates.flat()}
        stroke={info.color}
        strokeWidth={1}
        onMouseDown={onSelect}
        onTouchStart={onSelect}
        strokeScaleEnabled={false}
        fill={`${info.color}33`}
        closed
      />
      {isSelected && (
        <PolygonTransformer
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          stage={stage}
          dragLayer={dragLayer}
        />
      )}
    </>
  );
}
