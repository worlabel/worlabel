import { Label } from '@/types';
import Konva from 'konva';
import { Line } from 'react-konva';
import PolygonTransformer from './PolygonTransformer';

export default function LabelPolygon({
  isSelected,
  onSelect,
  info,
  setLabel,
  stage,
  dragLayer,
}: {
  isSelected: boolean;
  onSelect: () => void;
  info: Label;
  setLabel: (coordinate: [number, number][]) => void;
  stage: Konva.Stage;
  dragLayer: Konva.Layer;
}) {
  const handleChange = (coordinates: [number, number][]) => {
    setLabel(coordinates);
  };

  return (
    <>
      <Line
        points={info.coordinates.flat()}
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
          coordinates={info.coordinates}
          setCoordinates={handleChange}
          stage={stage}
          dragLayer={dragLayer}
        />
      )}
    </>
  );
}
