import { LabelJson } from '@/types';

export default function createLabelJson(type: 'classification' | 'detection' | 'segmentation'): LabelJson {
  return {
    version: '0.1.0',
    task_type: type === 'classification' ? 'cls' : type === 'detection' ? 'det' : 'seg',
    shapes: [],
    split: 'none',
    imageHeight: 0,
    imageWidth: 0,
    imageDepth: 3,
  };
}
