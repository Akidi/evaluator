import { evaluate, getReferencedVars, type VarRow, type CustomFnRow } from '$lib/formula';

export interface CurvePoint {
  x: number;
  y: number;
}
export interface Series {
  name: string;
  points: CurvePoint[];
}

const MAX_SAMPLES = 120;

/** The variable to sweep along x, when a formula references exactly one. */
export function defaultXVar(expr: string): string | undefined {
  const refs = getReferencedVars(expr);
  return refs.length === 1 ? refs[0] : undefined;
}

/** Evaluate `expr` while sweeping `xVar` across `range`, one point per sample. */
export function sweepFormula(
  expr: string,
  variables: VarRow[],
  functions: CustomFnRow[],
  xVar: string,
  range: { min: number; max: number },
): CurvePoint[] {
  const { min, max } = range;
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return [];
  const span = max - min;
  const samples = Math.min(MAX_SAMPLES, Math.max(2, Math.floor(span) + 1));
  const points: CurvePoint[] = [];
  for (let i = 0; i < samples; i++) {
    const x = min + (span * i) / (samples - 1);
    let replaced = false;
    const swept = variables.map((v) => {
      if (v.name.trim() === xVar) {
        replaced = true;
        return { ...v, value: String(x) };
      }
      return v;
    });
    if (!replaced) swept.push({ name: xVar, value: String(x) });
    const res = evaluate(expr, swept, functions);
    if (res.ok && typeof res.value === 'number' && Number.isFinite(res.value)) {
      points.push({ x, y: res.value });
    }
  }
  return points;
}

/** One line series per variable across a stepper timeline. */
export function stepperSeries(
  timeline: { step: number; vars: Record<string, number> }[],
): Series[] {
  if (timeline.length === 0) return [];
  const names = Object.keys(timeline[0].vars);
  return names.map((name) => ({
    name,
    points: timeline.map((snap) => ({ x: snap.step, y: snap.vars[name] })),
  }));
}
