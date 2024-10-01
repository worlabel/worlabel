import { useEffect, useState } from 'react';
import { Image, Layer, Stage, Line, Rect, Text, Group } from 'react-konva';
import useImage from 'use-image';
import { Label, Shape } from '@/types';
import useCommentListQuery from '@/queries/comments/useCommentListQuery';
import { Toggle } from '@/components/ui/toggle';

interface ImageWithLabelsProps {
  imagePath: string;
  labelData: string;
  projectId: number;
  imageId: number;
}

export default function ImageWithLabels({ imagePath, labelData, projectId, imageId }: ImageWithLabelsProps) {
  const [image] = useImage(imagePath);
  const [labels, setLabels] = useState<Label[]>([]);
  const [stageDimensions, setStageDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { data: commentList } = useCommentListQuery(projectId, imageId);
  const [showComments, setShowComments] = useState(true);

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

  return (
    <div>
      <Toggle
        variant="default"
        size="sm"
        pressed={showComments}
        onPressedChange={(pressed) => setShowComments(pressed)}
        className="mb-4"
      >
        {showComments ? '댓글 숨기기' : '댓글 보기'}
      </Toggle>
      <Stage
        width={stageDimensions.width}
        height={stageDimensions.height}
        className="overflow-hidden bg-gray-200"
        scale={getScale()}
      >
        <Layer>{image && <Image image={image} />}</Layer>
        <Layer>
          {labels.map((label) =>
            label.type === 'rectangle' ? (
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
        {showComments && (
          <Layer>
            {commentList?.map((comment) => (
              <Group
                key={comment.id}
                x={comment.positionX}
                y={comment.positionY}
              >
                <Rect
                  width={150}
                  height={50}
                  fill="white"
                  cornerRadius={10}
                  shadowBlur={5}
                />
                <Text
                  x={10}
                  y={10}
                  text={comment.content}
                  fontSize={14}
                  fill="black"
                  width={130}
                  listening={false}
                />
              </Group>
            ))}
          </Layer>
        )}
      </Stage>
    </div>
  );
}
