import Konva from 'konva';
import { Circle, Line } from 'react-konva';

interface PolygonTransformerProps {
  coordinates: Array<[number, number]>;
  setCoordinates: (coordinates: Array<[number, number]>) => void;
}

// TODO: scale 상관 없이 고정된 크기로 표시되도록 수정
export default function PolygonTransformer({ coordinates, setCoordinates }: PolygonTransformerProps) {
  const handleDragMove = (index: number) => (e: Konva.KonvaEventObject<DragEvent>) => {
    const circle = e.target as Konva.Circle;
    const stage = circle.getStage();
    const pos = circle.position();
    const newCoordinates = [...coordinates];

    newCoordinates[index] = [pos.x, pos.y];
    setCoordinates(newCoordinates);
    stage?.batchDraw();
  };
  const handleMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const circle = e.target as Konva.Circle;
    const stage = circle.getStage();
    circle.strokeWidth(2);
    circle.radius(15);
    stage?.batchDraw();
  };
  const handleMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const circle = e.target as Konva.Circle;
    const stage = circle.getStage();
    circle.strokeWidth(1);
    circle.radius(10);
    stage?.batchDraw();
  };

  return (
    <>
      <Line
        points={coordinates.flat()}
        stroke="#00a1ff"
        strokeWidth={2}
        closed
        zIndex={1}
      />
      {coordinates.map((point, index) => {
        return (
          <Circle
            key={index}
            x={point[0]}
            y={point[1]}
            radius={10}
            stroke="#00a1ff"
            strokeWidth={1}
            fill="white"
            draggable
            onDragMove={handleDragMove(index)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          />
        );
      })}
    </>
  );
}
