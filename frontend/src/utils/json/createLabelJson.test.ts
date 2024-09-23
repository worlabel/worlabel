import createLabelJson from './createLabelJson';

describe('createLabelJson', () => {
  it('should create a label JSON for classification', () => {
    const result = createLabelJson('classification', 1080, 1920);
    expect(result).toEqual({
      version: '0.1.0',
      task_type: 'cls',
      shapes: [],
      split: 'none',
      imageHeight: 1080,
      imageWidth: 1920,
      imageDepth: 3,
    });
  });

  it('should create a label JSON for detection', () => {
    const result = createLabelJson('detection', 720, 1280);
    expect(result).toEqual({
      version: '0.1.0',
      task_type: 'det',
      shapes: [],
      split: 'none',
      imageHeight: 720,
      imageWidth: 1280,
      imageDepth: 3,
    });
  });

  it('should create a label JSON for segmentation', () => {
    const result = createLabelJson('segmentation', 480, 640);
    expect(result).toEqual({
      version: '0.1.0',
      task_type: 'seg',
      shapes: [],
      split: 'none',
      imageHeight: 480,
      imageWidth: 640,
      imageDepth: 3,
    });
  });
});
