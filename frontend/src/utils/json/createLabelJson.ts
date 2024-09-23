import { LabelJson } from '@/types';

export default function createLabelJson(
  type: 'classification' | 'detection' | 'segmentation',
  imageHeight: number,
  imageWidth: number
): LabelJson {
  return {
    version: '0.1.0',
    task_type: type === 'classification' ? 'cls' : type === 'detection' ? 'det' : 'seg',
    shapes: [],
    split: 'none',
    imageHeight,
    imageWidth,
    imageDepth: 3,
  };
}
