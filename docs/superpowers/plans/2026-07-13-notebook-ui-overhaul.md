# Notebook UI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the app as a computational notebook where formulas evaluate live and their curves are plotted, built on a headless workspace store so alternate shells (Instrument, IDE) are cheap follow-ups.

**Architecture:** Three layers. The existing pure engine (`$lib/formula`) is reused unchanged. A new headless core (`$lib/workspace`) holds all state (variables, functions, cells) in a Svelte-5 runes store provided via context. A new Notebook shell (`$lib/workspace/shells/notebook`) is a thin set of components that bind to the store; cells derive results with `$derived` calling the engine, so live-eval falls out of reactivity. A new token-driven `LineChart` design-system component renders the curves.

**Tech Stack:** SvelteKit, Svelte 5 (runes), TypeScript, Vitest (browser + node projects), Storybook, inline-SVG charting (no chart dependency).

## Global Constraints

- Package manager is **pnpm** — never npm/npx.
- **Svelte 5 runes mode** is forced for all non-`node_modules` files (`$state`, `$derived`, `$props`, `$bindable`).
- Unit test command: **`CI=true pnpm test:unit -- --run <path>`** (per project memory: bare `vitest run` flakes with a config error; `CI=true` is required). Run from `app/`.
- Vitest has **`expect: { requireAssertions: true }`** — every test body must contain at least one assertion.
- Test file placement: pure `.test.ts` → node "server" project; `*.svelte.test.ts` → chromium "client" project; `*.stories.svelte` play tests → "storybook" project.
- All component CSS uses the **`var(--hook, <default>)`** override pattern and design tokens from `src/lib/assets/css/*` — no hard-coded colors. New chart added under a new `molecules/charts/` category (mirrors the existing `molecules/actions/` precedent).
- Reuse existing design-system components (`Card`, `Button`, `FormField`, `Tag`, `Select`, `Heading`, `Stack`, `Cluster`, `Table*`) rather than re-building inputs.
- Engine entry point is `src/lib/formula.ts` (a file, not a folder). Exact exports used by this plan:
  - `evaluate(formula: string, vars: VarRow[], customFns?: CustomFnRow[]): EvalResult`
  - `runStepper(rules: RuleRow[], steps: number, vars: VarRow[], customFns?: CustomFnRow[]): StepperResult`
  - `getReferencedVars(expr: string): string[]`
  - `fillMissingVarsForCustomFns(vars: VarRow[], customFns: CustomFnRow[]): void`
  - `BUILT_IN_FNS: BuiltInFn[]`
  - Types: `VarRow = {name,value}`, `RuleRow = {variable,inc,div}`, `CustomFnRow = {name,expr,params}`, `EvalResult = {ok:true,value:number|boolean}|{ok:false,error:string}`, `StepperResult = {ok:true,result:StepResult}|{ok:false,error:string}` where `StepResult.timeline: {step:number, vars:Record<string,number>}[]` and `StepResult.final`.

---

### Task 1: LineChart geometry helpers (pure)

Pure SVG-projection math, isolated so it is node-testable without a browser.

**Files:**
- Create: `app/src/lib/components/molecules/charts/line-chart/line-chart.util.ts`
- Test: `app/src/lib/components/molecules/charts/line-chart/line-chart.util.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `interface Point { x: number; y: number }`
  - `interface Bounds { minX: number; maxX: number; minY: number; maxY: number }`
  - `computeBounds(seriesPoints: Point[][]): Bounds`
  - `project(p: Point, b: Bounds, w: number, h: number, pad?: number): Point`
  - `toPath(points: Point[], b: Bounds, w: number, h: number, pad?: number): string`
  - `toAreaPath(points: Point[], b: Bounds, w: number, h: number, pad?: number): string`

- [ ] **Step 1: Write the failing test**

```ts
// line-chart.util.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && CI=true pnpm test:unit -- --run src/lib/components/molecules/charts/line-chart/line-chart.util.test.ts`
Expected: FAIL — cannot resolve `./line-chart.util`.

- [ ] **Step 3: Write minimal implementation**

```ts
// line-chart.util.ts
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
  if (minX === maxX) maxX = minX + 1;
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && CI=true pnpm test:unit -- --run src/lib/components/molecules/charts/line-chart/line-chart.util.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/lib/components/molecules/charts/line-chart/line-chart.util.ts app/src/lib/components/molecules/charts/line-chart/line-chart.util.test.ts
git commit -m "feat: add LineChart geometry helpers"
```

---

### Task 2: LineChart component + story

Token-driven inline-SVG chart consuming Task 1's helpers. Single series → optional area fill; multi-series → categorical colors + legend.

**Files:**
- Create: `app/src/lib/components/molecules/charts/line-chart/line-chart.svelte`
- Create: `app/src/lib/components/molecules/charts/line-chart/line-chart.stories.svelte`
- Modify: `app/src/lib/components/molecules/index.ts` (add export)

**Interfaces:**
- Consumes: `computeBounds`, `toPath`, `toAreaPath`, `Point` from `./line-chart.util`.
- Produces: default export `LineChart` with props
  `series: { name: string; color?: string; points: Point[] }[]`, `height?: string`,
  `showAxes?: boolean`, `fillArea?: boolean`, `xLabel?: string`, `yLabel?: string`.
  Exported from `$lib/components/molecules` as `LineChart`.

- [ ] **Step 1: Load the dataviz skill for palette/axis guidance**

Invoke the `dataviz` skill and apply its categorical-palette + axis/contrast guidance to the colors and ticks below. Keep everything token-driven and theme-aware (light/dark).

- [ ] **Step 2: Write the component**

```svelte
<!-- line-chart.svelte -->
<!--
  @component LineChart

  Token-driven inline-SVG line chart. One series renders as a curve with an
  optional area fill; multiple series render as distinct colored lines with a
  legend. Responsive via viewBox; no external dependencies.

  @prop series    - One or more { name, points: {x,y}[], color? }.
  @prop height    - CSS height of the plot. Default: '11rem'.
  @prop showAxes  - Render baseline + left axis and min/max tick labels. Default: true.
  @prop fillArea  - Area fill under the first series (best for single-series). Default: false.
  @prop xLabel/yLabel - Optional axis captions.
-->
<script lang="ts">
  import { computeBounds, toPath, toAreaPath, type Point } from './line-chart.util';

  interface Series {
    name: string;
    points: Point[];
    color?: string;
  }
  interface Props {
    series: Series[];
    height?: string;
    showAxes?: boolean;
    fillArea?: boolean;
    xLabel?: string;
    yLabel?: string;
  }

  let {
    series,
    height = '11rem',
    showAxes = true,
    fillArea = false,
    xLabel,
    yLabel,
  }: Props = $props();

  // Fixed internal viewBox; SVG scales to the container via width/height.
  const W = 320;
  const H = 160;
  const PAD = 6;

  // Categorical palette from tokens (see dataviz skill). Extend as needed.
  const PALETTE = [
    'var(--primary)',
    'var(--accent)',
    'var(--info)',
    'var(--success)',
    'var(--warning)',
    'var(--error)',
  ];

  let bounds = $derived(computeBounds(series.map((s) => s.points)));
  let hasData = $derived(series.some((s) => s.points.length > 0));
  let multi = $derived(series.length > 1);

  function colorFor(s: Series, i: number): string {
    return s.color ?? PALETTE[i % PALETTE.length];
  }
</script>

<figure data-component="line-chart" style="--chart-height: {height}">
  {#if hasData}
    <svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" role="img" aria-label={yLabel ?? 'chart'}>
      {#if showAxes}
        <line class="axis" x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} />
        <line class="axis" x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} />
      {/if}
      {#if fillArea && series[0]}
        <path
          class="area"
          d={toAreaPath(series[0].points, bounds, W, H, PAD)}
          style="--series-color: {colorFor(series[0], 0)}"
        />
      {/if}
      {#each series as s, i (s.name)}
        <path
          class="line"
          d={toPath(s.points, bounds, W, H, PAD)}
          style="--series-color: {colorFor(s, i)}"
        />
      {/each}
    </svg>
    {#if showAxes}
      <div class="ticks">
        <span>{bounds.minY.toLocaleString()}</span>
        <span>{bounds.maxY.toLocaleString()}</span>
      </div>
    {/if}
    {#if multi}
      <ul class="legend">
        {#each series as s, i (s.name)}
          <li><span class="swatch" style="background: {colorFor(s, i)}"></span>{s.name}</li>
        {/each}
      </ul>
    {/if}
    {#if xLabel}<figcaption>{xLabel}</figcaption>{/if}
  {:else}
    <p class="empty">No data to plot yet.</p>
  {/if}
</figure>

<style>
  [data-component='line-chart'] {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }
  [data-component='line-chart'] svg {
    width: 100%;
    height: var(--chart-height, 11rem);
    display: block;
    overflow: visible;
  }
  .axis {
    stroke: var(--border);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }
  .line {
    fill: none;
    stroke: var(--series-color, var(--primary));
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
    transition: d var(--duration-fast, 150ms) var(--ease-default, ease);
  }
  .area {
    fill: var(--series-color, var(--primary));
    opacity: 0.12;
    stroke: none;
  }
  .ticks {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-xs);
    color: var(--text-faint);
    font-variant-numeric: tabular-nums;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    list-style: none;
    padding: 0;
    font-size: var(--text-xs);
    color: var(--text-muted);
  }
  .legend li {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
  }
  .swatch {
    width: 0.75rem;
    height: 0.25rem;
    border-radius: var(--radius-full, 999px);
  }
  figcaption {
    font-size: var(--text-xs);
    color: var(--text-faint);
    text-align: center;
  }
  .empty {
    font-size: var(--text-sm);
    color: var(--text-faint);
    padding: var(--space-4);
    text-align: center;
  }
</style>
```

- [ ] **Step 3: Add the export**

In `app/src/lib/components/molecules/index.ts`, under the `// Actions` block add a new group:

```ts
// Charts
export { default as LineChart } from './charts/line-chart/line-chart.svelte';
```

- [ ] **Step 4: Write the story (with a render test)**

```svelte
<!-- line-chart.stories.svelte -->
<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LineChart from './line-chart.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Charts/LineChart',
    component: LineChart,
    tags: ['autodocs'],
  });

  const parabola = Array.from({ length: 20 }, (_, i) => ({ x: i, y: i * i }));
  const seriesA = Array.from({ length: 20 }, (_, i) => ({ x: i, y: i * 2 }));
  const seriesB = Array.from({ length: 20 }, (_, i) => ({ x: i, y: 40 - i }));
</script>

<Story name="Single series (area)" asChild>
  <LineChart series={[{ name: 'y', points: parabola }]} fillArea xLabel="x" />
</Story>

<Story name="Multi series" asChild>
  <LineChart
    series={[
      { name: 'hp', points: seriesA },
      { name: 'mp', points: seriesB },
    ]}
  />
</Story>

<Story name="Empty" asChild>
  <LineChart series={[]} />
</Story>

<Story
  name="Renders an svg path for data"
  asChild
  play={async ({ canvasElement }) => {
    const paths = canvasElement.querySelectorAll('path.line');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')?.startsWith('M')).toBe(true);
  }}
>
  <LineChart series={[{ name: 'y', points: parabola }]} />
</Story>
```

- [ ] **Step 5: Verify in Storybook**

Run: `cd app && pnpm storybook`
Confirm the three visual stories render (single-series area curve, two-line multi-series with legend, empty state) in both light and dark. Stop Storybook when done.

- [ ] **Step 6: Commit**

```bash
git add app/src/lib/components/molecules/charts app/src/lib/components/molecules/index.ts
git commit -m "feat: add token-driven LineChart component"
```

---

### Task 3: Curve data helpers (pure)

Turn formulas/stepper output into `LineChart` series. Node-testable against the real engine.

**Files:**
- Create: `app/src/lib/workspace/curve.ts`
- Test: `app/src/lib/workspace/curve.test.ts`

**Interfaces:**
- Consumes: `evaluate`, `getReferencedVars`, types `VarRow`, `CustomFnRow` from `$lib/formula`; `Point` from the chart util is NOT imported (keep workspace independent of components) — define a local `CurvePoint`.
- Produces:
  - `interface CurvePoint { x: number; y: number }`
  - `interface Series { name: string; points: CurvePoint[] }`
  - `defaultXVar(expr: string): string | undefined`
  - `sweepFormula(expr, variables, functions, xVar, range: {min:number;max:number}): CurvePoint[]`
  - `stepperSeries(timeline: { step: number; vars: Record<string, number> }[]): Series[]`

- [ ] **Step 1: Write the failing test**

```ts
// curve.test.ts
import { describe, expect, test } from 'vitest';
import { defaultXVar, sweepFormula, stepperSeries } from './curve';
import type { VarRow, CustomFnRow } from '$lib/formula';

const NO_FNS: CustomFnRow[] = [];

describe('defaultXVar', () => {
  test('returns the sole referenced variable', () => {
    expect(defaultXVar('level * 2')).toBe('level');
  });
  test('returns undefined when the formula references multiple variables', () => {
    expect(defaultXVar('a + b')).toBeUndefined();
  });
  test('returns undefined for a constant expression', () => {
    expect(defaultXVar('1 + 2')).toBeUndefined();
  });
});

describe('sweepFormula', () => {
  const vars: VarRow[] = [{ name: 'level', value: '1' }];
  test('samples the endpoints of an integer range for a linear formula', () => {
    const pts = sweepFormula('level * 2', vars, NO_FNS, 'level', { min: 1, max: 5 });
    expect(pts.length).toBe(5);
    expect(pts[0]).toEqual({ x: 1, y: 2 });
    expect(pts.at(-1)).toEqual({ x: 5, y: 10 });
  });
  test('returns [] for an invalid range', () => {
    expect(sweepFormula('level', vars, NO_FNS, 'level', { min: 5, max: 5 })).toEqual([]);
  });
  test('skips points where evaluation does not produce a finite number', () => {
    const pts = sweepFormula('1 / (level - 3)', vars, NO_FNS, 'level', { min: 1, max: 5 });
    // level=3 -> division yields non-finite; that point is dropped.
    expect(pts.every((p) => Number.isFinite(p.y))).toBe(true);
    expect(pts.some((p) => p.x === 3)).toBe(false);
  });
});

describe('stepperSeries', () => {
  test('produces one series per variable across the timeline', () => {
    const series = stepperSeries([
      { step: 0, vars: { hp: 100, mp: 10 } },
      { step: 1, vars: { hp: 110, mp: 12 } },
    ]);
    expect(series.map((s) => s.name)).toEqual(['hp', 'mp']);
    expect(series[0].points).toEqual([
      { x: 0, y: 100 },
      { x: 1, y: 110 },
    ]);
  });
  test('returns [] for an empty timeline', () => {
    expect(stepperSeries([])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && CI=true pnpm test:unit -- --run src/lib/workspace/curve.test.ts`
Expected: FAIL — cannot resolve `./curve`.

- [ ] **Step 3: Write minimal implementation**

```ts
// curve.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && CI=true pnpm test:unit -- --run src/lib/workspace/curve.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/lib/workspace/curve.ts app/src/lib/workspace/curve.test.ts
git commit -m "feat: add curve data helpers for formula sweep and stepper series"
```

---

### Task 4: Workspace types + headless store

The core contract every shell binds to: variables, functions, cells + actions, provided via context.

**Files:**
- Create: `app/src/lib/workspace/types.ts`
- Create: `app/src/lib/workspace/workspace.svelte.ts`
- Test: `app/src/lib/workspace/workspace.svelte.test.ts`

**Interfaces:**
- Consumes: `fillMissingVarsForCustomFns`, types `VarRow`, `RuleRow`, `CustomFnRow` from `$lib/formula`; `browser` from `$app/environment`.
- Produces (from `types.ts`):
  - `type FormulaCell = { id: string; type: 'formula'; expr: string; xVar?: string; xRange?: { min: number; max: number } }`
  - `type StepperCell = { id: string; type: 'stepper'; rules: RuleRow[]; steps: number }`
  - `type Cell = FormulaCell | StepperCell`
  - re-exports `VarRow`, `RuleRow`, `CustomFnRow`
- Produces (from `workspace.svelte.ts`):
  - `interface Workspace` with getters `variables: VarRow[]`, `functions: CustomFnRow[]`, `cells: Cell[]` and methods `addVariable()`, `removeVariable(i: number)`, `addFunction()`, `removeFunction(i: number)`, `persistFunctions()`, `loadFunctions()`, `refreshDerivedVars()`, `addCell(type: 'formula' | 'stepper')`, `removeCell(id: string)`, `moveCell(id: string, dir: -1 | 1)`
  - `createWorkspace(): Workspace`
  - `setWorkspace(ws?: Workspace): Workspace`
  - `getWorkspace(): Workspace`

- [ ] **Step 1: Write the types file**

```ts
// types.ts
import type { VarRow, RuleRow, CustomFnRow } from '$lib/formula';

export type FormulaCell = {
  id: string;
  type: 'formula';
  expr: string;
  xVar?: string;
  xRange?: { min: number; max: number };
};

export type StepperCell = {
  id: string;
  type: 'stepper';
  rules: RuleRow[];
  steps: number;
};

export type Cell = FormulaCell | StepperCell;

export type { VarRow, RuleRow, CustomFnRow };
```

- [ ] **Step 2: Write the failing store test**

```ts
// workspace.svelte.test.ts
import { describe, expect, test } from 'vitest';
import { createWorkspace } from './workspace.svelte';

describe('createWorkspace', () => {
  test('starts with one empty variable, function, and formula cell', () => {
    const ws = createWorkspace();
    expect(ws.variables.length).toBe(1);
    expect(ws.functions.length).toBe(1);
    expect(ws.cells.length).toBe(1);
    expect(ws.cells[0].type).toBe('formula');
  });

  test('addCell appends a cell of the requested type', () => {
    const ws = createWorkspace();
    ws.addCell('stepper');
    expect(ws.cells.length).toBe(2);
    const last = ws.cells.at(-1)!;
    expect(last.type).toBe('stepper');
    if (last.type === 'stepper') {
      expect(last.rules.length).toBe(1);
      expect(last.steps).toBe(5);
    }
  });

  test('removeCell removes by id', () => {
    const ws = createWorkspace();
    ws.addCell('formula');
    const id = ws.cells[0].id;
    ws.removeCell(id);
    expect(ws.cells.some((c) => c.id === id)).toBe(false);
  });

  test('moveCell swaps a cell with its neighbor', () => {
    const ws = createWorkspace();
    ws.addCell('stepper'); // now [formula, stepper]
    const stepperId = ws.cells[1].id;
    ws.moveCell(stepperId, -1);
    expect(ws.cells[0].id).toBe(stepperId);
  });

  test('moveCell is a no-op at the boundary', () => {
    const ws = createWorkspace();
    ws.addCell('stepper');
    const firstId = ws.cells[0].id;
    ws.moveCell(firstId, -1);
    expect(ws.cells[0].id).toBe(firstId);
  });

  test('addVariable and removeVariable adjust the variable list', () => {
    const ws = createWorkspace();
    ws.addVariable();
    expect(ws.variables.length).toBe(2);
    ws.removeVariable(0);
    expect(ws.variables.length).toBe(1);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd app && CI=true pnpm test:unit -- --run src/lib/workspace/workspace.svelte.test.ts`
Expected: FAIL — cannot resolve `./workspace.svelte`.

- [ ] **Step 4: Write the store**

```ts
// workspace.svelte.ts
import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';
import { fillMissingVarsForCustomFns, type VarRow, type CustomFnRow } from '$lib/formula';
import type { Cell } from './types';

const KEY = Symbol('workspace');
const FN_STORAGE_KEY = 'formula.customFns';

let counter = 0;
const uid = () => `cell-${Date.now().toString(36)}-${counter++}`;

function makeCell(type: 'formula' | 'stepper'): Cell {
  return type === 'formula'
    ? { id: uid(), type: 'formula', expr: '' }
    : { id: uid(), type: 'stepper', rules: [{ variable: '', inc: '', div: '' }], steps: 5 };
}

export interface Workspace {
  readonly variables: VarRow[];
  readonly functions: CustomFnRow[];
  readonly cells: Cell[];
  addVariable(): void;
  removeVariable(i: number): void;
  addFunction(): void;
  removeFunction(i: number): void;
  persistFunctions(): void;
  loadFunctions(): void;
  refreshDerivedVars(): void;
  addCell(type: 'formula' | 'stepper'): void;
  removeCell(id: string): void;
  moveCell(id: string, dir: -1 | 1): void;
}

export function createWorkspace(): Workspace {
  const variables = $state<VarRow[]>([{ name: '', value: '' }]);
  const functions = $state<CustomFnRow[]>([{ name: '', expr: '', params: '' }]);
  const cells = $state<Cell[]>([makeCell('formula')]);

  function persistFunctions() {
    if (!browser) return;
    const toSave = functions.filter((f) => f.name.trim() !== '' && f.expr.trim() !== '');
    localStorage.setItem(FN_STORAGE_KEY, JSON.stringify(toSave));
  }

  function loadFunctions() {
    if (!browser) return;
    const raw = localStorage.getItem(FN_STORAGE_KEY);
    if (!raw) return;
    const parsed: Partial<CustomFnRow>[] = JSON.parse(raw);
    functions.splice(
      0,
      functions.length,
      ...parsed.map((f) => ({ name: f.name ?? '', expr: f.expr ?? '', params: f.params ?? '' })),
    );
    if (functions.length === 0) functions.push({ name: '', expr: '', params: '' });
  }

  return {
    get variables() {
      return variables;
    },
    get functions() {
      return functions;
    },
    get cells() {
      return cells;
    },
    addVariable() {
      variables.push({ name: '', value: '' });
    },
    removeVariable(i: number) {
      variables.splice(i, 1);
    },
    addFunction() {
      functions.push({ name: '', expr: '', params: '' });
    },
    removeFunction(i: number) {
      functions.splice(i, 1);
      persistFunctions();
    },
    persistFunctions,
    loadFunctions,
    refreshDerivedVars() {
      fillMissingVarsForCustomFns(variables, functions);
    },
    addCell(type) {
      cells.push(makeCell(type));
    },
    removeCell(id: string) {
      const i = cells.findIndex((c) => c.id === id);
      if (i >= 0) cells.splice(i, 1);
    },
    moveCell(id: string, dir: -1 | 1) {
      const i = cells.findIndex((c) => c.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= cells.length) return;
      [cells[i], cells[j]] = [cells[j], cells[i]];
    },
  };
}

export function setWorkspace(ws: Workspace = createWorkspace()): Workspace {
  setContext(KEY, ws);
  return ws;
}

export function getWorkspace(): Workspace {
  return getContext<Workspace>(KEY);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd app && CI=true pnpm test:unit -- --run src/lib/workspace/workspace.svelte.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add app/src/lib/workspace/types.ts app/src/lib/workspace/workspace.svelte.ts app/src/lib/workspace/workspace.svelte.test.ts
git commit -m "feat: add headless workspace store and types"
```

---

### Task 5: ScopeBar + FunctionsPanel

The shared-scope header: variables inline, plus a collapsible functions library (with a built-ins insert palette).

**Files:**
- Create: `app/src/lib/workspace/shells/notebook/ScopeBar.svelte`
- Create: `app/src/lib/workspace/shells/notebook/FunctionsPanel.svelte`

**Interfaces:**
- Consumes: `getWorkspace` from `$lib/workspace/workspace.svelte`; `BUILT_IN_FNS`, `getReferencedVars`, `getParamNames` from `$lib/formula`; `Card`, `FormField`, `Button`, `Tag`, `Heading`, `Stack`, `Cluster` from `$lib/components/{molecules,atoms,layouts}`.
- Produces: default exports `ScopeBar` and `FunctionsPanel` (no props; both read the workspace from context).

- [ ] **Step 1: Write FunctionsPanel**

```svelte
<!-- FunctionsPanel.svelte -->
<script lang="ts">
  import { getWorkspace } from '$lib/workspace/workspace.svelte';
  import { BUILT_IN_FNS, getReferencedVars, getParamNames } from '$lib/formula';
  import { FormField } from '$lib/components/molecules';
  import { Button, Tag, Heading } from '$lib/components/atoms';
  import { Stack, Cluster } from '$lib/components/layouts';

  const ws = getWorkspace();

  function usedVars(expr: string, params: string): string[] {
    const p = new Set(getParamNames(params));
    return getReferencedVars(expr).filter((n) => !p.has(n));
  }
</script>

<details data-component="functions-panel">
  <summary><Heading level={2} size="sm">Functions</Heading></summary>

  <Stack space="var(--space-3)">
    {#each ws.functions as f, i (i)}
      <Stack space="var(--space-1)">
        <Cluster space="var(--space-2)" align="flex-end">
          <div style="width: 7rem; flex-shrink: 0;">
            <FormField label="Name" placeholder="name" bind:value={f.name} onblur={ws.persistFunctions} />
          </div>
          <div style="width: 7rem; flex-shrink: 0;">
            <FormField
              label="Params"
              placeholder="x, y"
              bind:value={f.params}
              onblur={() => {
                ws.refreshDerivedVars();
                ws.persistFunctions();
              }}
            />
          </div>
          <div style="flex: 1; min-width: 0;">
            <FormField
              label="Expression"
              placeholder="e.g. 80 + floor(pow(level, 1.6))"
              bind:value={f.expr}
              onblur={() => {
                ws.refreshDerivedVars();
                ws.persistFunctions();
              }}
            />
          </div>
          <Button variant="ghost" onclick={() => ws.removeFunction(i)} aria-label="Remove function">−</Button>
        </Cluster>
        {#if f.expr.trim() !== ''}
          {@const vars = usedVars(f.expr, f.params)}
          {#if vars.length > 0}
            <Cluster space="var(--space-1)">
              {#each vars as name (name)}<Tag variant="primary">{name}</Tag>{/each}
            </Cluster>
          {/if}
        {/if}
      </Stack>
    {/each}
    <Button variant="secondary" onclick={ws.addFunction}>+ function</Button>

    <Heading level={3} size="xs">Built-ins</Heading>
    <Cluster space="var(--space-1)">
      {#each BUILT_IN_FNS as fn (fn.name)}
        <Tag variant="secondary">{fn.signature}</Tag>
      {/each}
    </Cluster>
  </Stack>
</details>

<style>
  [data-component='functions-panel'] {
    border: 1px solid var(--border);
    border-radius: var(--radius-md, 0.5rem);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    padding: var(--space-3) var(--space-4);
  }
  summary {
    cursor: pointer;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  details[open] summary {
    margin-block-end: var(--space-3);
  }
</style>
```

- [ ] **Step 2: Write ScopeBar**

```svelte
<!-- ScopeBar.svelte -->
<script lang="ts">
  import { getWorkspace } from '$lib/workspace/workspace.svelte';
  import FunctionsPanel from './FunctionsPanel.svelte';
  import { FormField } from '$lib/components/molecules';
  import { Button, Heading } from '$lib/components/atoms';
  import { Stack, Cluster } from '$lib/components/layouts';

  const ws = getWorkspace();
</script>

<Stack space="var(--space-3)" data-component="scope-bar">
  <Heading level={2} size="sm">Scope</Heading>
  <Cluster space="var(--space-2)" align="flex-end">
    {#each ws.variables as v, i (i)}
      <Cluster space="var(--space-1)" align="flex-end" style="flex-wrap: nowrap;">
        <div style="width: 6rem;">
          <FormField label="Name" placeholder="name" bind:value={v.name} />
        </div>
        <div style="width: 5rem;">
          <FormField label="Value" placeholder="value" bind:value={v.value} />
        </div>
        <Button variant="ghost" onclick={() => ws.removeVariable(i)} aria-label="Remove variable">−</Button>
      </Cluster>
    {/each}
    <Button variant="secondary" onclick={ws.addVariable}>+ var</Button>
  </Cluster>

  <FunctionsPanel />
</Stack>
```

- [ ] **Step 3: Verify it type-checks**

Run: `cd app && pnpm check 2>&1 | grep -E "ScopeBar|FunctionsPanel" || echo "no errors in new files"`
Expected: `no errors in new files` (pre-existing engine-package errors are unrelated — see the depth-pass note).

- [ ] **Step 4: Commit**

```bash
git add app/src/lib/workspace/shells/notebook/ScopeBar.svelte app/src/lib/workspace/shells/notebook/FunctionsPanel.svelte
git commit -m "feat: add notebook ScopeBar and FunctionsPanel"
```

---

### Task 6: FormulaCell

A live formula cell: expression in, `= value` out, referenced-var tags, save-as-function, and a swept curve.

**Files:**
- Create: `app/src/lib/workspace/shells/notebook/FormulaCell.svelte`

**Interfaces:**
- Consumes: `getWorkspace`; `evaluate`, `getReferencedVars` from `$lib/formula`; `sweepFormula`, `defaultXVar` from `$lib/workspace/curve`; `LineChart`, `FormField`, `Card` from molecules; `Button`, `Tag`, `Select` from atoms; `Cluster`, `Stack` from layouts; type `FormulaCell` from `$lib/workspace/types`.
- Produces: default export `FormulaCell` with prop `cell: FormulaCell` (bindable via the store's array element).

- [ ] **Step 1: Write the component**

```svelte
<!-- FormulaCell.svelte -->
<script lang="ts">
  import { getWorkspace } from '$lib/workspace/workspace.svelte';
  import { evaluate, getReferencedVars } from '$lib/formula';
  import { sweepFormula, defaultXVar } from '$lib/workspace/curve';
  import type { FormulaCell } from '$lib/workspace/types';
  import { LineChart, FormField, Card } from '$lib/components/molecules';
  import { Button, Tag, Select } from '$lib/components/atoms';
  import { Cluster, Stack } from '$lib/components/layouts';

  interface Props {
    cell: FormulaCell;
  }
  let { cell }: Props = $props();

  const ws = getWorkspace();
  let saveName = $state('');

  let result = $derived(cell.expr.trim() === '' ? null : evaluate(cell.expr, ws.variables, ws.functions));
  let refs = $derived(getReferencedVars(cell.expr));

  // Resolve which variable to sweep + a default 1..20 range.
  let xVar = $derived(cell.xVar ?? defaultXVar(cell.expr));
  let xRange = $derived(cell.xRange ?? { min: 1, max: 20 });
  let curve = $derived(
    xVar ? sweepFormula(cell.expr, ws.variables, ws.functions, xVar, xRange) : [],
  );

  function saveAsFunction() {
    const name = saveName.trim();
    const expr = cell.expr.trim();
    if (name === '' || expr === '') return;
    const existing = ws.functions.find((f) => f.name.trim() === name);
    if (existing) existing.expr = expr;
    else ws.functions.push({ name, expr, params: '' });
    ws.refreshDerivedVars();
    ws.persistFunctions();
    saveName = '';
  }
</script>

<Card>
  <Stack space="var(--space-3)">
    <FormField label="Formula" placeholder="e.g. 80 + floor(pow(level, 1.6))" bind:value={cell.expr} mono />

    {#if result}
      {#if result.ok}
        <p class="result">= {String(result.value)}</p>
      {:else}
        <p class="error">{result.error}</p>
      {/if}
    {/if}

    {#if refs.length > 0}
      <Cluster space="var(--space-1)">
        {#each refs as name (name)}<Tag variant="primary">{name}</Tag>{/each}
      </Cluster>
    {/if}

    {#if xVar && curve.length > 0}
      <LineChart series={[{ name: cell.expr, points: curve }]} fillArea xLabel={xVar} />
      <Cluster space="var(--space-2)" align="flex-end" style="flex-wrap: nowrap;">
        <div style="width: 7rem;">
          <label class="mini">sweep
            <Select bind:value={cell.xVar}>
              {#each refs as name (name)}<option value={name}>{name}</option>{/each}
            </Select>
          </label>
        </div>
        <div style="width: 5rem;">
          <FormField label="min" type="number" value={xRange.min}
            oninput={(e) => (cell.xRange = { min: Number(e.currentTarget.value), max: xRange.max })} />
        </div>
        <div style="width: 5rem;">
          <FormField label="max" type="number" value={xRange.max}
            oninput={(e) => (cell.xRange = { min: xRange.min, max: Number(e.currentTarget.value) })} />
        </div>
      </Cluster>
    {/if}

    <Cluster space="var(--space-2)" align="flex-end" style="flex-wrap: nowrap;">
      <div style="flex: 1; min-width: 0;">
        <FormField label="Save as function" placeholder="name" bind:value={saveName}
          onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && saveAsFunction()} />
      </div>
      <Button variant="secondary" onclick={saveAsFunction}>Save</Button>
      <Button variant="ghost" onclick={() => ws.removeCell(cell.id)} aria-label="Remove cell">−</Button>
    </Cluster>
  </Stack>
</Card>

<style>
  .result {
    font-family: var(--font-mono);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text);
    margin: 0;
  }
  .error {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--error-text);
    margin: 0;
  }
  .mini {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
  }
</style>
```

> **Note on `mono` prop:** `FormField` may not yet forward a `mono` styling hint. If `pnpm check` flags it, drop the `mono` attribute here and instead set `style="font-family: var(--font-mono)"` on the field wrapper — do not add scope to `FormField` in this task.

- [ ] **Step 2: Verify it type-checks**

Run: `cd app && pnpm check 2>&1 | grep -E "FormulaCell" || echo "no errors in FormulaCell"`
Expected: `no errors in FormulaCell`.

- [ ] **Step 3: Commit**

```bash
git add app/src/lib/workspace/shells/notebook/FormulaCell.svelte
git commit -m "feat: add live FormulaCell with swept curve"
```

---

### Task 7: StepperCell

The stepper reframed as a cell: rules editor + live multi-series curve + collapsible numeric table.

**Files:**
- Create: `app/src/lib/workspace/shells/notebook/StepperCell.svelte`

**Interfaces:**
- Consumes: `getWorkspace`; `runStepper` from `$lib/formula`; `stepperSeries` from `$lib/workspace/curve`; `LineChart`, `FormField`, `Card` from molecules; `Button`, `Select`, `Table`, `TableHead`, `TableHeader`, `TableRow`, `TableBody`, `TableCell` from atoms; `Cluster`, `Stack` from layouts; type `StepperCell` from `$lib/workspace/types`.
- Produces: default export `StepperCell` with prop `cell: StepperCell`.

- [ ] **Step 1: Write the component**

```svelte
<!-- StepperCell.svelte -->
<script lang="ts">
  import { getWorkspace } from '$lib/workspace/workspace.svelte';
  import { runStepper } from '$lib/formula';
  import { stepperSeries } from '$lib/workspace/curve';
  import type { StepperCell } from '$lib/workspace/types';
  import { LineChart, FormField, Card } from '$lib/components/molecules';
  import {
    Button,
    Select,
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
  } from '$lib/components/atoms';
  import { Cluster, Stack } from '$lib/components/layouts';

  interface Props {
    cell: StepperCell;
  }
  let { cell }: Props = $props();

  const ws = getWorkspace();

  let outcome = $derived(runStepper(cell.rules, cell.steps, ws.variables, ws.functions));
  let series = $derived(outcome.ok ? stepperSeries(outcome.result.timeline) : []);
  let varNames = $derived(series.map((s) => s.name));

  function addRule() {
    cell.rules.push({ variable: '', inc: '', div: '' });
  }
  function removeRule(i: number) {
    cell.rules.splice(i, 1);
  }
  function moveRuleUp(i: number) {
    if (i === 0) return;
    [cell.rules[i - 1], cell.rules[i]] = [cell.rules[i], cell.rules[i - 1]];
  }
  function moveRuleDown(i: number) {
    if (i === cell.rules.length - 1) return;
    [cell.rules[i], cell.rules[i + 1]] = [cell.rules[i + 1], cell.rules[i]];
  }

  // Tracks which rule rows are mid-flow adding a brand new variable, keyed by
  // rule index, so the dropdown can swap to a name input just for that row.
  const NEW_VAR_OPTION = '__new__';
  let addingVarForRule = $state<Set<number>>(new Set());

  function onRuleVariableSelect(i: number, value: string) {
    if (value === NEW_VAR_OPTION) {
      addingVarForRule.add(i);
      addingVarForRule = new Set(addingVarForRule);
      cell.rules[i].variable = '';
    } else {
      cell.rules[i].variable = value;
    }
  }
  function commitNewRuleVariable(i: number, name: string) {
    const trimmed = name.trim();
    if (trimmed === '') {
      cancelNewRuleVariable(i);
      return;
    }
    if (!ws.variables.some((v) => v.name.trim() === trimmed)) {
      ws.variables.push({ name: trimmed, value: '0' });
    }
    cell.rules[i].variable = trimmed;
    addingVarForRule.delete(i);
    addingVarForRule = new Set(addingVarForRule);
  }
  function cancelNewRuleVariable(i: number) {
    addingVarForRule.delete(i);
    addingVarForRule = new Set(addingVarForRule);
  }
</script>

<Card>
  <Stack space="var(--space-4)">
    <Stack space="var(--space-2)">
      {#each cell.rules as r, i (i)}
        <Cluster space="var(--space-2)" align="flex-end">
          <Cluster space="0" style="flex-direction: column; flex-shrink: 0;">
            <Button variant="ghost" disabled={i === 0} onclick={() => moveRuleUp(i)} aria-label="Move rule up">↑</Button>
            <Button variant="ghost" disabled={i === cell.rules.length - 1} onclick={() => moveRuleDown(i)} aria-label="Move rule down">↓</Button>
          </Cluster>

          {#if addingVarForRule.has(i)}
            <div style="width: 7rem; flex-shrink: 0;">
              <FormField
                label="Variable"
                placeholder="new name"
                autofocus
                onkeydown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter') commitNewRuleVariable(i, (e.currentTarget as HTMLInputElement).value);
                  if (e.key === 'Escape') cancelNewRuleVariable(i);
                }}
                onblur={(e: FocusEvent) => commitNewRuleVariable(i, (e.currentTarget as HTMLInputElement).value)}
              />
            </div>
          {:else}
            <div style="width: 8rem; flex-shrink: 0;">
              <label class="mini">variable
                <Select value={r.variable} onchange={(e) => onRuleVariableSelect(i, e.currentTarget.value)}>
                  <option value="" disabled>variable</option>
                  {#each ws.variables as v (v.name)}
                    {#if v.name.trim() !== ''}<option value={v.name.trim()}>{v.name.trim()}</option>{/if}
                  {/each}
                  <option value={NEW_VAR_OPTION}>+ new variable</option>
                </Select>
              </label>
            </div>
          {/if}

          <div style="flex: 1; min-width: 0;"><FormField label="Inc" placeholder="inc" bind:value={r.inc} /></div>
          <div style="width: 5rem;"><FormField label="Div" placeholder="div" bind:value={r.div} /></div>
          <Button variant="ghost" onclick={() => removeRule(i)} aria-label="Remove rule">−</Button>
        </Cluster>
      {/each}
      <Cluster space="var(--space-2)" align="flex-end">
        <Button variant="secondary" onclick={addRule}>+ rule</Button>
        <div style="width: 6rem;"><FormField label="Steps" type="number" bind:value={cell.steps} min="0" /></div>
        <Button variant="ghost" onclick={() => ws.removeCell(cell.id)} aria-label="Remove cell">−</Button>
      </Cluster>
    </Stack>

    {#if !outcome.ok}
      <p class="error">{outcome.error}</p>
    {:else if series.length > 0}
      <LineChart {series} xLabel="step" />
      <details>
        <summary>Show timeline</summary>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>step</TableHeader>
              {#each varNames as name (name)}<TableHeader>{name}</TableHeader>{/each}
            </TableRow>
          </TableHead>
          <TableBody>
            {#each outcome.result.timeline as snap (snap.step)}
              <TableRow>
                <TableCell>{snap.step}</TableCell>
                {#each varNames as name (name)}<TableCell>{snap.vars[name]}</TableCell>{/each}
              </TableRow>
            {/each}
          </TableBody>
        </Table>
      </details>
    {/if}
  </Stack>
</Card>

<style>
  .mini {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
  }
  .error {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--error-text);
    margin: 0;
  }
  summary {
    cursor: pointer;
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
</style>
```

This mirrors the reorder and inline "+ new variable" behavior from the original page's Stepper tab (`moveRuleUp`/`moveRuleDown`, `addingVarForRule` Set, `commitNewRuleVariable`/`cancelNewRuleVariable`) exactly, scoped to `cell.rules` and `ws.variables` instead of page-local state — per the spec's "preserved" requirement.

- [ ] **Step 2: Verify it type-checks**

Run: `cd app && pnpm check 2>&1 | grep -E "StepperCell" || echo "no errors in StepperCell"`
Expected: `no errors in StepperCell`.

- [ ] **Step 3: Commit**

```bash
git add app/src/lib/workspace/shells/notebook/StepperCell.svelte
git commit -m "feat: add StepperCell with live multi-series curve"
```

---

### Task 8: Notebook shell + route mount

Compose scope + cells, provide the workspace context, and swap the route to render it.

**Files:**
- Create: `app/src/lib/workspace/shells/notebook/Notebook.svelte`
- Create: `app/src/lib/workspace/index.ts`
- Modify: `app/src/routes/+page.svelte` (replace entire contents)

**Interfaces:**
- Consumes: `setWorkspace`, `getWorkspace` from `$lib/workspace/workspace.svelte`; `ScopeBar`, `FormulaCell`, `StepperCell`; `Heading`, `Button` from atoms; `PageShell`, `Stack`, `Cluster` from layouts; `onMount`.
- Produces: default export `Notebook` (no props; calls `setWorkspace()` itself so it is self-contained). `$lib/workspace/index.ts` re-exports `Notebook`, `createWorkspace`, `setWorkspace`, `getWorkspace`, and the `curve` helpers.

- [ ] **Step 1: Write Notebook.svelte**

```svelte
<!-- Notebook.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { setWorkspace } from '$lib/workspace/workspace.svelte';
  import ScopeBar from './ScopeBar.svelte';
  import FormulaCell from './FormulaCell.svelte';
  import StepperCell from './StepperCell.svelte';
  import { Heading, Button } from '$lib/components/atoms';
  import { PageShell, Stack, Cluster } from '$lib/components/layouts';

  const ws = setWorkspace();
  onMount(() => {
    ws.loadFunctions();
    ws.refreshDerivedVars();
  });
</script>

<PageShell tag="main">
  <Stack space="var(--space-6)">
    <Heading level={1} size="2xl">Formula Notebook</Heading>

    <ScopeBar />

    <Stack space="var(--space-4)">
      {#each ws.cells as cell, i (cell.id)}
        <div class="cell-row">
          <div class="gutter">
            <span class="index">{i + 1}</span>
            <div class="reorder">
              <Button variant="ghost" onclick={() => ws.moveCell(cell.id, -1)} aria-label="Move up">↑</Button>
              <Button variant="ghost" onclick={() => ws.moveCell(cell.id, 1)} aria-label="Move down">↓</Button>
            </div>
          </div>
          <div class="cell-body">
            {#if cell.type === 'formula'}
              <FormulaCell {cell} />
            {:else}
              <StepperCell {cell} />
            {/if}
          </div>
        </div>
      {/each}
    </Stack>

    <Cluster space="var(--space-2)">
      <Button variant="secondary" onclick={() => ws.addCell('formula')}>+ formula</Button>
      <Button variant="secondary" onclick={() => ws.addCell('stepper')}>+ stepper</Button>
    </Cluster>
  </Stack>
</PageShell>

<style>
  .cell-row {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    gap: var(--space-2);
  }
  .gutter {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    padding-top: var(--space-3);
  }
  .index {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-faint);
  }
  .reorder {
    display: flex;
    flex-direction: column;
  }
  .cell-body {
    min-width: 0;
  }
  @media (max-width: 40rem) {
    .cell-row {
      grid-template-columns: 1fr;
    }
    .gutter {
      flex-direction: row;
      justify-content: flex-start;
      padding-top: 0;
    }
  }
</style>
```

- [ ] **Step 2: Write the workspace barrel**

```ts
// $lib/workspace/index.ts
export { default as Notebook } from './shells/notebook/Notebook.svelte';
export { createWorkspace, setWorkspace, getWorkspace, type Workspace } from './workspace.svelte';
export * from './curve';
export * from './types';
```

- [ ] **Step 3: Replace the route with a thin mount**

Replace the **entire** contents of `app/src/routes/+page.svelte` with:

```svelte
<script lang="ts">
  import { Notebook } from '$lib/workspace';
</script>

<Notebook />
```

- [ ] **Step 4: Verify it builds and serves**

```bash
cd app && pnpm dev --port 5199 >/tmp/nb-dev.log 2>&1 &
sleep 7
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5199/
curl -s http://localhost:5199/ | grep -o 'Formula Notebook\|data-component="scope-bar"\|data-component="formula-cell"' | sort -u
# stop the server (find the PID listening on 5199 and kill it)
```
Expected: `200`, and all three markers present.

- [ ] **Step 5: Commit**

```bash
git add app/src/lib/workspace/shells/notebook/Notebook.svelte app/src/lib/workspace/index.ts app/src/routes/+page.svelte
git commit -m "feat: mount Notebook shell on the home route"
```

---

### Task 9: Live-eval polish + end-to-end verification

Debounce heavy recomputation, confirm the whole flow, and remove the now-dead inline logic.

**Files:**
- Modify: `app/src/lib/workspace/shells/notebook/FormulaCell.svelte` and `StepperCell.svelte` (debounce)
- Verify only: the full app.

- [ ] **Step 1: Add a debounced expression mirror to FormulaCell**

To keep typing smooth, evaluate/sweep against a debounced copy of `cell.expr` rather than every keystroke. Add near the top of `FormulaCell.svelte`'s script:

```ts
  let debouncedExpr = $state(cell.expr);
  let timer: ReturnType<typeof setTimeout>;
  $effect(() => {
    const next = cell.expr;
    clearTimeout(timer);
    timer = setTimeout(() => (debouncedExpr = next), 120);
    return () => clearTimeout(timer);
  });
```

Then change the `result`, `refs`, `xVar`, and `curve` deriveds to read `debouncedExpr` instead of `cell.expr` (the input still binds to `cell.expr` for responsiveness).

- [ ] **Step 2: Add the same debounce guard to StepperCell**

Cap steps so a large value can't freeze the sweep. Change the `outcome` derived:

```ts
  let outcome = $derived(runStepper(cell.rules, Math.min(cell.steps, 500), ws.variables, ws.functions));
```

- [ ] **Step 3: Run the full unit suite**

Run: `cd app && CI=true pnpm test:unit -- --run`
Expected: all `line-chart.util`, `curve`, and `workspace` tests PASS; Storybook `LineChart` story test PASSES.

- [ ] **Step 4: Drive the app end-to-end**

```bash
cd app && pnpm dev
```
In the browser, confirm:
1. A variable `level = 1` in the ScopeBar; a formula cell `80 + floor(pow(level, 1.6))` shows `= 80` **and** an area curve; editing `level` or the formula updates both live.
2. `+ stepper` adds a cell; adding a rule + steps plots a multi-series curve; "Show timeline" reveals the table.
3. Reorder (↑/↓), remove cells, `+ formula`.
4. Functions panel: save a formula as a function, reload the page → it persists.
5. Toggle light/dark (top-right) → cells, curves, and text all adapt.

- [ ] **Step 5: Type-check the whole app**

Run: `cd app && pnpm check 2>&1 | tail -3`
Expected: no NEW errors in `src/lib/workspace/**` or `src/routes/+page.svelte` (pre-existing engine-package `verbatimModuleSyntax` errors are unrelated and out of scope).

- [ ] **Step 6: Commit**

```bash
git add app/src/lib/workspace/shells/notebook/FormulaCell.svelte app/src/lib/workspace/shells/notebook/StepperCell.svelte
git commit -m "perf: debounce live-eval and cap stepper steps"
```

---

## Self-Review

**Spec coverage:**
- Core/headless store → Task 4. ✅
- Curve data (formula sweep + stepper series) → Task 3. ✅
- LineChart component → Tasks 1–2. ✅
- Notebook shell (scope bar, functions panel, formula cell, stepper cell, cell list) → Tasks 5–8. ✅
- Live-eval via `$derived` + debounce → built into cells; tuned in Task 9. ✅
- Route swap to thin mount → Task 8. ✅
- Functions persistence (existing localStorage key) → Task 4 store. ✅
- Extensibility seam (context contract) → Task 4 `get/setWorkspace`; documented in spec. ✅
- Verification (pnpm test convention, Storybook, dark mode) → Tasks 2, 9. ✅

**Deferred from spec (explicitly out of v1 scope, noted in tasks):** full-workspace persistence (functions only for now); shell-switcher (seam only).

**Placeholder scan:** No TBD/TODO. The two inline `> Note:` blocks describe concrete fallbacks (drop `mono`, drop reorder) with exact actions, not deferred work.

**Type consistency:** `Workspace` getters/methods used by ScopeBar/FunctionsPanel/cells/Notebook match the interface in Task 4 (`addVariable`, `removeVariable`, `addFunction`, `removeFunction`, `persistFunctions`, `loadFunctions`, `refreshDerivedVars`, `addCell`, `removeCell`, `moveCell`, `variables`, `functions`, `cells`). `CurvePoint`/`Series` from Task 3 match `stepperSeries`/`sweepFormula` usage in Tasks 6–7. `LineChart` `series` prop shape (`{name, points}`) matches both cells. `FormulaCell`/`StepperCell` types from Task 4 match the props consumed in Tasks 6–7 and the discriminated `cell.type` switch in Task 8.
