# Notebook UI Overhaul — Design Spec

**Date:** 2026-07-13
**Status:** Draft for review
**Owner:** James Rhamy (design/feel delegated to Claude)

## Context

The app ("Formula Evaluator") is presented as a generic tabbed form — Variables + Custom
Functions cards on top, an Evaluate tab and a Stepper tab below. But its actual purpose is
**designing numeric progression curves**: XP/leveling curves, growth rates, game-balance
formulas. The evidence is the domain itself — the `toNextLevel` example
(`80 + floor(pow(level, 1.6))`), the Stepper that advances variables by rules over N steps,
and the "save a formula as a reusable function" loop.

The current UI makes you *read numbers* (a table of digits) when the whole point is to *feel a
curve's shape*. This overhaul reframes the app from "a form you submit" into "an instrument you
play": **live evaluation + plotted curves**, with a computational-notebook layout.

It is also designed so two additional shell "personalities" (Instrument, IDE) can be added later
cheaply, without reworking the engine or state. This spec covers **the Notebook shell only**;
the others are explicitly out of scope here but the architecture makes them fast follow-ups.

## Goals

- Reframe the workspace as a **computational notebook**: shared scope + ordered, live cells.
- **Plot curves** as the primary output, not tables.
- **Live evaluation**: cells and curves react as you type / drag, with no "Run" button.
- Preserve **all** existing functionality: evaluate, save-as-function, custom functions, stepper.
- Establish a **core/shell split** so Instrument + IDE shells are additive later.
- Keep the design system portable — new pieces are token-driven and self-contained.

## Non-Goals

- Building the Instrument or IDE shells (architecture only).
- A shell-switcher UI (leave the seam; build later).
- Changing the formula engine's grammar or evaluation semantics.

## Architecture — three layers

```
Engine (pure, exists)      $lib/formula        evaluate(), runStepper(), getReferencedVars()...
        │  reused unchanged
Core (headless, new)       $lib/workspace      state + context: variables, functions, cells
        │  the contract every shell binds to
Shell (new)                $lib/workspace/shells/notebook    Notebook UI components
```

- **Engine** stays pure and untouched. All computation goes through it.
- **Core** holds *inputs only* (no markup): a Svelte-5 runes store provided via context. Cells
  derive their results with `$derived` calling engine functions, so **live-eval falls out of
  reactivity** — no manual recompute wiring.
- **Shell** is a thin set of components reading/writing the store. Notebook is the first consumer.

### The store contract (the extensibility seam)

`$lib/workspace/workspace.svelte.ts` exposes reactive state + actions via `setContext`/
`getContext` under a symbol key. Any future shell calls `getWorkspace()` and binds to the same
state. Adding Instrument/IDE later = a new `shells/<name>/` folder + (optionally) a switcher that
renders a different shell component. Core and `LineChart` are already paid for.

## Data model

```ts
// $lib/workspace/types.ts
type FormulaCell = {
  id: string;
  type: 'formula';
  expr: string;
  xVar?: string;                 // variable swept along the curve's x-axis
  xRange?: { min: number; max: number };
};

type StepperCell = {
  id: string;
  type: 'stepper';
  rules: RuleRow[];              // { variable, inc, div } — reused from $lib/formula
  steps: number;
};

type Cell = FormulaCell | StepperCell;
```

Shared scope reuses existing engine types: `VarRow` (name/value) and `CustomFnRow`
(name/expr/params).

### Store state + actions

- State: `variables: VarRow[]`, `functions: CustomFnRow[]`, `cells: Cell[]`.
- Variable actions: `addVariable`, `removeVariable`, (update via `$bindable`/direct mutation).
- Function actions: `addFunction`, `removeFunction`, `persistFunctions` (localStorage key
  `formula.customFns`, preserving current behavior), `loadFunctionIntoCell`.
- Cell actions: `addCell(type)`, `removeCell(id)`, `moveCell(id, dir)`, cells mutated directly.
- Persistence: functions persist as today. **Stretch:** persist the full workspace
  (variables + cells) to localStorage so a session survives reload. Not required for v1.

### Derived results (live-eval)

Computed in the cell components, not stored:

- **Formula cell value:** `evaluate(expr, variables, functions)` → `= value` or inline error.
- **Formula cell curve:** clone `variables`, sweep `xVar` across `xRange` (default: the sole
  referenced variable, range `1..20`), `evaluate` at each point → one `LineChart` series.
  Referenced vars come from `getReferencedVars(expr)`. Constant expressions (no referenced var)
  render a value only, no curve.
- **Stepper cell curve:** `runStepper(rules, steps, variables, functions)` → timeline → **one
  series per variable** over steps `0..N`. The numeric table becomes a collapsible secondary view.

Evaluation is debounced (~120ms) and step counts are capped to keep live-eval responsive.

## New component — `LineChart` (design system)

The design system has no chart; the overhaul depends on one. Build a small, self-contained,
**token-driven inline-SVG** line chart (zero dependencies), placed in a new
`molecules/charts/line-chart/` category (mirrors the `actions/` precedent).

```
Props:
  series:    { name: string; color?: string; points: { x: number; y: number }[] }[]
  height?:   string           // default ~10rem
  showAxes?: boolean          // default true
  showGrid?: boolean          // default true (faint)
  fillArea?: boolean          // area fill under a single series (formula curves)
  xLabel?, yLabel?: string
```

- Responsive: `viewBox` + `width: 100%`; scrolls nothing, scales down.
- Theme-aware via tokens; multi-series colors come from a token-based **categorical palette**.
- The `dataviz` skill is consulted when styling (palette, axes, ticks, contrast, light/dark).
- Single-series formula curves get a soft area fill (primary) + a marker/label at the current
  value; multi-series stepper curves get a small legend of variable names.
- Ships a Storybook story (visual + a render assertion).

## Notebook shell — look & feel

Computational-notebook aesthetic: calm, generous whitespace, **monospace for formulas and
values** (`--font-mono`, already used for `code`), cells as raised surfaces
(`--shadow-sm`) on the sunken page ground established in the recent depth pass. The **curve is the
hero** and gets room. Subtle motion: curves transition on change; cells fade in when added.

### Scope bar (top, sticky-ish)

- Variables as compact `name = value` mono inputs in a row, inline `+ var`, remove per chip.
- Collapsible **Functions panel** (the shared library): each function's name/params/expression,
  referenced-var tags, `load` (into a new/last formula cell) and inline save. The `BUILT_IN_FNS`
  reference doubles as an **insert palette** here.

### Cell list (reorderable, ordered)

Each cell has a left gutter (index + type glyph, drag handle for reorder).

- **Formula cell**
  - Mono expression input (full width, grows).
  - Result strip: large mono `= value`, referenced-var tags, actions (save as function, remove).
  - Curve: `LineChart` sweeping `xVar` over `xRange`, with a compact x-var picker + range
    (min/max) and smart defaults. No referenced var → value only, no curve.
  - Errors render **inline in the cell** (error-color text), never a dismissible banner.
- **Stepper cell**
  - Rules editor: the existing variable-select (with "+ new variable" inline-add), inc, div,
    reorder up/down, remove — preserved.
  - Steps input; evaluates **live** (debounced, capped) — no Run button.
  - Curve: multi-series `LineChart` over steps `0..N`, legend of variable names.
  - Collapsible numeric timeline table (secondary).
- Add affordances: `+ formula`, `+ stepper`.

**Nothing is lost** — evaluate, save-as-function, custom functions, and the stepper all survive,
reframed as live cells with curves.

## Files

**New**
- `app/src/lib/workspace/types.ts`
- `app/src/lib/workspace/workspace.svelte.ts` — store + `setWorkspace`/`getWorkspace` context.
- `app/src/lib/workspace/shells/notebook/Notebook.svelte`
- `app/src/lib/workspace/shells/notebook/ScopeBar.svelte`
- `app/src/lib/workspace/shells/notebook/FunctionsPanel.svelte`
- `app/src/lib/workspace/shells/notebook/FormulaCell.svelte`
- `app/src/lib/workspace/shells/notebook/StepperCell.svelte`
- `app/src/lib/components/molecules/charts/line-chart/line-chart.svelte`
- `app/src/lib/components/molecules/charts/line-chart/line-chart.stories.svelte`

**Modified**
- `app/src/routes/+page.svelte` → thin mount: set workspace context + render `<Notebook />`.
  All current inline state/logic migrates into the store (its natural home).
- `app/src/lib/components/molecules/index.ts` → export `LineChart`.

The recent depth + theme-toggle work stays and applies throughout.

## Implementation phases (for the plan)

1. **`LineChart`** — isolated, token-driven, with Storybook story. Verifiable alone.
2. **Workspace core** — `types.ts` + `workspace.svelte.ts`, with unit tests for actions.
3. **Notebook shell** — cells + scope bar + functions panel, binding to the store.
4. **Swap the route** — `+page.svelte` mounts `<Notebook />`; retire old inline logic.
5. **Polish + verify** — motion, dark mode, responsive; end-to-end drive.

## Verification

- Engine stays pure and unit-tested: `CI=true pnpm test` (per project convention; `vitest run`
  flakes here).
- Store actions get unit tests.
- `LineChart` verified in Storybook (visual + render assertion).
- Drive the Notebook in `pnpm dev`: type a formula → curve updates live; edit a variable →
  every dependent cell + curve reacts; add/reorder/remove cells; stepper timeline plots. Check
  light **and** dark.

## Risks / open questions

- **Live-eval cost** on large step counts or many cells → debounce + cap steps; revisit if needed.
- **Curve x-axis defaults** for multi-variable formulas — default to the sole referenced var; when
  ambiguous, require the user to pick (no curve until then).
- Full-workspace persistence is a stretch; v1 persists functions only (current behavior).
