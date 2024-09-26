import createLabelJson from './createLabelJson';

describe('createLabelJson', () => {
  it('should create a label JSON for classification', () => {
    const result = createLabelJson('classification');
    expect(result).toEqual({
      version: '0.1.0',
      task_type: 'cls',
      shapes: [],
      split: 'none',
      imageHeight: 0,
      imageWidth: 0,
      imageDepth: 3,
    });
  });

  it('should create a label JSON for detection', () => {
    const result = createLabelJson('detection');
    expect(result).toEqual({
      version: '0.1.0',
      task_type: 'det',
      shapes: [],
      split: 'none',
      imageHeight: 0,
      imageWidth: 0,
      imageDepth: 3,
    });
  });

  it('should create a label JSON for segmentation', () => {
    const result = createLabelJson('segmentation');
    expect(result).toEqual({
      version: '0.1.0',
      task_type: 'seg',
      shapes: [],
      split: 'none',
      imageHeight: 0,
      imageWidth: 0,
      imageDepth: 3,
    });
  });
});
