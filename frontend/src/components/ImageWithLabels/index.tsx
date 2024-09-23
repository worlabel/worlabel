import { useEffect, useState } from 'react';
import { Image, Layer, Stage, Line, Rect } from 'react-konva';
import useImage from 'use-image';
import { Label } from '@/types';

interface Shape {
  label: string;
  color: string;
  points: [number, number][];
  shape_type: 'polygon' | 'rectangle';
}

interface ImageWithLabelsProps {
  imagePath: string;
  labelData: string;
}

export default function ImageWithLabels({ imagePath, labelData }: ImageWithLabelsProps) {
  const [image] = useImage(imagePath);
  const [labels, setLabels] = useState<Label[]>([]);
  const [stageDimensions, setStageDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const fetchLabelData = async () => {
      try {
        const response = await fetch(labelData);
        const json: { shapes: Shape[] } = await response.json();
        const shapes = json.shapes.map((shape, index) => ({
          id: index,
          name: shape.label,
          color: shape.color,
          type: shape.shape_type === 'polygon' ? 'polygon' : 'rect',
          coordinates: shape.points,
        })) as Label[];
        setLabels(shapes);
      } catch (error) {
        console.error('Failed to fetch label data:', error);
      }
    };

    fetchLabelData();
  }, [labelData]);

  useEffect(() => {
    const updateDimensions = () => {
      setStageDimensions({
        width: window.innerWidth - 280,
        height: window.innerHeight - 64,
      });
    };
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const getScale = () => {
    if (!image) return { x: 1, y: 1 };
    const widthRatio = stageDimensions.width / image.width;
    const heightRatio = stageDimensions.height / image.height;
    const scale = Math.min(widthRatio, heightRatio);
    return { x: scale, y: scale };
  };

  return image ? (
    <Stage
      width={stageDimensions.width}
      height={stageDimensions.height}
      className="overflow-hidden bg-gray-200"
      scale={getScale()}
    >
      <Layer>{image && <Image image={image} />}</Layer>
      <Layer>
        {labels.map((label) =>
          label.type === 'rect' ? (
            <Rect
              key={label.id}
              x={label.coordinates[0][0]}
              y={label.coordinates[0][1]}
              width={label.coordinates[1][0] - label.coordinates[0][0]}
              height={label.coordinates[1][1] - label.coordinates[0][1]}
              stroke={label.color}
              strokeWidth={2}
              listening={false}
            />
          ) : (
            <Line
              key={label.id}
              points={label.coordinates.flat()}
              stroke={label.color}
              strokeWidth={2}
              closed
              listening={false}
            />
          )
        )}
      </Layer>
    </Stage>
  ) : (
    <div></div>
  );
}
