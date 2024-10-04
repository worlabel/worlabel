import { useEffect, useState } from 'react';
import { Image, Layer, Stage, Line, Rect } from 'react-konva';
import useImage from 'use-image';
import { Label, Shape } from '@/types';

interface ImageSelectionWithLabelsProps {
  imagePath: string;
  labelData: string;
  width: number;
  height: number;
}

export default function ImageSelectionWithLabels({
  imagePath,
  labelData,
  width,
  height,
}: ImageSelectionWithLabelsProps) {
  const [image] = useImage(imagePath, 'anonymous');
  const [labels, setLabels] = useState<Label[]>([]);
  const [stageDimensions, setStageDimensions] = useState<{ width: number; height: number }>({ width, height });

  useEffect(() => {
    if (image) {
      const widthRatio = width / image.width;
      const heightRatio = height / image.height;
      const scale = Math.min(widthRatio, heightRatio);
      setStageDimensions({
        width: image.width * scale,
        height: image.height * scale,
      });
    }
  }, [image, width, height]);

  useEffect(() => {
    const fetchLabelData = async () => {
      try {
        const response = await fetch(labelData);
        const json: { shapes: Shape[] } = await response.json();
        const shapes = json.shapes.map((shape, index) => ({
          id: index,
          categoryId: shape.categoryId,
          color: shape.color,
          type: shape.shape_type,
          coordinates: shape.points,
        })) as Label[];
        setLabels(shapes);
      } catch (error) {
        console.error('Failed to fetch label data:', error);
      }
    };

    fetchLabelData();
  }, [labelData]);

  if (!stageDimensions || !image) return null;

  return (
    <Stage
      width={stageDimensions.width}
      height={stageDimensions.height}
      className="overflow-hidden bg-gray-200"
    >
      <Layer>
        <Image
          image={image}
          width={stageDimensions.width}
          height={stageDimensions.height}
        />
      </Layer>
      <Layer>
        {labels.map((label) =>
          label.type === 'rectangle' ? (
            <Rect
              key={label.id}
              x={label.coordinates[0][0] * (stageDimensions.width / image.width)}
              y={label.coordinates[0][1] * (stageDimensions.height / image.height)}
              width={(label.coordinates[1][0] - label.coordinates[0][0]) * (stageDimensions.width / image.width)}
              height={(label.coordinates[1][1] - label.coordinates[0][1]) * (stageDimensions.height / image.height)}
              stroke={label.color}
              strokeWidth={2}
              listening={false}
            />
          ) : (
            <Line
              key={label.id}
              points={label.coordinates
                .flat()
                .map((point, index) =>
                  index % 2 === 0
                    ? point * (stageDimensions.width / image.width)
                    : point * (stageDimensions.height / image.height)
                )}
              stroke={label.color}
              strokeWidth={2}
              closed
              listening={false}
            />
          )
        )}
      </Layer>
    </Stage>
  );
}
