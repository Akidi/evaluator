import { describe, expect, test } from 'vitest';
import { computeBounds, project, toPath, toAreaPath, type Point } from './line-chart.util';

describe('computeBounds', () => {
  test('returns a unit box for empty input', () => {
    expect(computeBounds([])).toEqual({ minX: 0, maxX: 1, minY: 0, maxY: 1 });
  });
  test('spans all points across all series', () => {
    const b = computeBounds([[{ x: 0, y: 2 }], [{ x: 5, y: -1 }]]);
    expect(b).toEqual({ minX: 0, maxX: 5, minY: -1, maxY: 2 });
  });
  test('pads a flat y range so the line is not on the edge', () => {
    const b = computeBounds([[{ x: 0, y: 3 }, { x: 4, y: 3 }]]);
    expect(b.minY).toBeLessThan(3);
    expect(b.maxY).toBeGreaterThan(3);
  });
  test('pads a flat x range so a single point is centered, not left-pinned', () => {
    const b = computeBounds([[{ x: 5, y: 0 }, { x: 5, y: 4 }]]);
    expect(b.minX).toBeLessThan(5);
    expect(b.maxX).toBeGreaterThan(5);
  });
});

describe('project', () => {
  const b = { minX: 0, maxX: 10, minY: 0, maxY: 10 };
  test('maps bottom-left data corner to bottom-left pixel (y inverted)', () => {
    expect(project({ x: 0, y: 0 }, b, 100, 100)).toEqual({ x: 0, y: 100 });
  });
  test('maps top-right data corner to top-right pixel', () => {
    expect(project({ x: 10, y: 10 }, b, 100, 100)).toEqual({ x: 100, y: 0 });
  });
});

describe('toPath / toAreaPath', () => {
  const b = { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  test('toPath starts with M then L commands', () => {
    const d = toPath([{ x: 0, y: 0 }, { x: 1, y: 1 }], b, 100, 100);
    expect(d.startsWith('M')).toBe(true);
    expect(d).toContain('L');
  });
  test('toPath is empty for no points', () => {
    expect(toPath([], b, 100, 100)).toBe('');
  });
  test('toAreaPath closes the path with Z', () => {
    const d = toAreaPath([{ x: 0, y: 0 }, { x: 1, y: 1 }], b, 100, 100);
    expect(d.endsWith('Z')).toBe(true);
  });
});
