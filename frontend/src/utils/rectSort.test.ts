import { describe, it, expect } from 'vitest';
import rectSort from './rectSort';

describe('rectSort', () => {
  it('should sort coordinates when first point is top-left and second point is bottom-right', () => {
    const result = rectSort([
      [1, 2],
      [3, 4],
    ]);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('should sort coordinates when first point is bottom-right and second point is top-left', () => {
    const result = rectSort([
      [3, 4],
      [1, 2],
    ]);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('should sort coordinates when first point is bottom-left and second point is top-right', () => {
    const result = rectSort([
      [1, 4],
      [3, 2],
    ]);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('should sort coordinates when first point is top-right and second point is bottom-left', () => {
    const result = rectSort([
      [3, 2],
      [1, 4],
    ]);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });
});
