export interface Point {
  x: number;
  y: number;
}
export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function computeBounds(seriesPoints: Point[][]): Bounds {
  const all = seriesPoints.flat();
  if (all.length === 0) return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of all) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  if (minY === maxY) {
    minY -= 1;
    maxY += 1;
  }
  if (minX === maxX) {
    minX -= 1;
    maxX += 1;
  }
  return { minX, maxX, minY, maxY };
}

export function project(p: Point, b: Bounds, w: number, h: number, pad = 0): Point {
  const spanX = b.maxX - b.minX || 1;
  const spanY = b.maxY - b.minY || 1;
  const x = pad + ((p.x - b.minX) / spanX) * (w - 2 * pad);
  const y = h - pad - ((p.y - b.minY) / spanY) * (h - 2 * pad);
  return { x, y };
}

export function toPath(points: Point[], b: Bounds, w: number, h: number, pad = 0): string {
  if (points.length === 0) return '';
  return points
    .map((p, i) => {
      const { x, y } = project(p, b, w, h, pad);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

export function toAreaPath(points: Point[], b: Bounds, w: number, h: number, pad = 0): string {
  if (points.length === 0) return '';
  const line = toPath(points, b, w, h, pad);
  const first = project(points[0], b, w, h, pad);
  const last = project(points[points.length - 1], b, w, h, pad);
  const baseline = h - pad;
  return `${line} L${last.x.toFixed(2)},${baseline.toFixed(2)} L${first.x.toFixed(2)},${baseline.toFixed(2)} Z`;
}
