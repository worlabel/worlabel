import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Circle, Group, Line } from 'react-konva';

interface PolygonTransformerProps {
  coordinates: Array<[number, number]>;
  setCoordinates: (coordinates: Array<[number, number]>) => void;
  stage: Konva.Stage;
}

const TRANSFORM_CHANGE_STR = [
  'widthChange',
  'heightChange',
  'scaleXChange',
  'skewXChange',
  'skewYChange',
  'rotationChange',
  'offsetXChange',
  'offsetYChange',
  'transformsEnabledChange',
  'strokeWidthChange',
];

export default function PolygonTransformer({ coordinates, setCoordinates, stage }: PolygonTransformerProps) {
  const trRef = useRef<Konva.Group>(null);
  const handleDragMove = (index: number) => (e: Konva.KonvaEventObject<DragEvent>) => {
    const circle = e.target as Konva.Circle;
    const pos = circle.position();
    const newCoordinates = [...coordinates];

    newCoordinates[index] = [pos.x, pos.y];
    setCoordinates(newCoordinates);
    stage.batchDraw();
  };
  const handleMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const circle = e.target as Konva.Circle;

    circle.radius(7);
    stage.batchDraw();
  };
  const handleMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const circle = e.target as Konva.Circle;

    circle.radius(5);
    stage?.batchDraw();
  };

  useEffect(() => {
    const transformEvents = TRANSFORM_CHANGE_STR.join(' ');

    stage.on(transformEvents, () => {
      if (!trRef.current) return;

      const [line, ...anchors] = trRef.current!.children as Konva.Shape[];

      line.strokeWidth(1 / stage.getAbsoluteScale().x);
      anchors.forEach((anchor) => {
        anchor.scale({
          x: 1 / stage.getAbsoluteScale().x,
          y: 1 / stage.getAbsoluteScale().y,
        });
      });
    });

    return () => {
      stage.off(transformEvents);
    };
  }, [stage]);

  return (
    <Group ref={trRef}>
      <Line
        points={coordinates.flat()}
        stroke="#00a1ff"
        strokeWidth={1 / stage.getAbsoluteScale().x}
        strokeScaleEnabled={true}
        closed
        zIndex={1}
        perfectDrawEnabled={false}
      />
      {coordinates.map((point, index) => {
        return (
          <Circle
            key={index}
            x={point[0]}
            y={point[1]}
            radius={5}
            stroke="#00a1ff"
            strokeWidth={1}
            fill="white"
            draggable
            onDragMove={handleDragMove(index)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            scale={{ x: 1 / stage.getAbsoluteScale().x, y: 1 / stage.getAbsoluteScale().y }}
            perfectDrawEnabled={false}
          />
        );
      })}
    </Group>
  );
}
