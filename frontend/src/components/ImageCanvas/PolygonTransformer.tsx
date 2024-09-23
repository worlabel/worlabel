import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';
import { useEffect, useRef } from 'react';
import { Circle, Group, Line } from 'react-konva';

interface PolygonTransformerProps {
  coordinates: Array<[number, number]>;
  setCoordinates: (coordinates: Array<[number, number]>) => void;
  stage: Konva.Stage;
  dragLayer: Konva.Layer;
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

export default function PolygonTransformer({ coordinates, setCoordinates, stage, dragLayer }: PolygonTransformerProps) {
  const anchorsRef = useRef<Konva.Group>(null);
  const scale: Vector2d = { x: 1 / stage.getAbsoluteScale().x, y: 1 / stage.getAbsoluteScale().y };
  const handleClick = (index: number) => (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 0 && e.evt.detail === 2) {
      const pos = stage.getRelativePointerPosition()!;
      const newCoordinates: [number, number][] = [
        ...coordinates.slice(0, index + 1),
        [pos.x, pos.y],
        ...coordinates.slice(index + 1),
      ];
      setCoordinates(newCoordinates);
      return;
    }

    if (e.evt.button !== 2) return;

    const newCoordinates = [...coordinates.slice(0, index), ...coordinates.slice(index + 1)];
    setCoordinates(newCoordinates);
  };
  const handleDragMove = (index: number) => (e: Konva.KonvaEventObject<DragEvent>) => {
    const circle = e.target as Konva.Circle;
    const pos = circle.position();
    const newCoordinates = [...coordinates];

    newCoordinates[index] = [pos.x, pos.y];
    setCoordinates(newCoordinates);
    // stage.batchDraw();
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
    anchorsRef.current?.moveTo(dragLayer);

    stage.on(transformEvents, () => {
      if (!anchorsRef.current) return;

      const anchors = anchorsRef.current!.children as Konva.Shape[];

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
  }, [dragLayer, stage]);

  return (
    <>
      <Line
        points={coordinates.flat()}
        stroke="#00a1ff"
        strokeWidth={1}
        strokeScaleEnabled={false}
        closed
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
        listening={false}
      />
      <Group ref={anchorsRef}>
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
              strokeScaleEnabled={false}
              onClick={handleClick(index)}
              onDragMove={handleDragMove(index)}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              scale={scale}
              perfectDrawEnabled={false}
              shadowForStrokeEnabled={false}
            />
          );
        })}
      </Group>
    </>
  );
}
