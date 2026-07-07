# Remove Tailwind, rebuild the formula page on `$lib/components` + `$lib/assets/css`

## Goal

Drop Tailwind as a dependency of the SvelteKit app entirely and rebuild
`app/src/routes/+page.svelte` from scratch on top of the existing (currently
unused-by-this-page) atomic-design component library at `app/src/lib/components`
and its token-based CSS at `app/src/lib/assets/css`.

## Background

`+page.svelte` is the only real UI in the app (variables, custom functions,
formula evaluator, stepper). It was originally built with Tailwind utility
classes. Separately, a full atoms/layouts/molecules/organisms component
library already exists in the repo, styled entirely with CSS custom
properties (`--space-*`, `--text-*`, `--primary`, etc.) via
`data-component`/`data-variant` attributes — no Tailwind dependency in any
component. Nothing in the app currently imports from `$lib/components`.

## Scope

**In scope:**
- Full rewrite of `+page.svelte` using `$lib/components` (atoms, layouts,
  molecules) instead of Tailwind utility classes.
- Removing Tailwind from the build: `vite.config.ts`, `package.json`
  (dependencies + any Tailwind-related devDependencies/plugins), `layout.css`,
  `AGENTS.md` add-ons list.
- Wiring `$lib/assets/css/index.css` in as the global stylesheet (replacing
  `@import 'tailwindcss'` etc. in `layout.css`).

**Out of scope:**
- Any change to `formula.ts`, `evaluator/*`, `stepper/*`, `parser/*`,
  `lexer/*` — this is a presentation-layer-only change.
- Redesigning the component library itself, its tokens, or Storybook.
- Any new components — only composing what already exists in
  `$lib/components`.

## Design

### Global styles

`app/src/routes/layout.css` currently does:
```css
@import 'tailwindcss';
@plugin '@tailwindcss/forms';
@plugin '@tailwindcss/typography';
```
This becomes:
```css
@import '$lib/assets/css/index.css';
```
(`index.css` already chains reset → colors → typography → spacing → layout →
components.)

### Page skeleton

- `PageShell` (`tag="main"`) as the outer content column, replacing the
  hand-rolled `<main class="mx-auto max-w-5xl ...">`.
- `Stack` for top-level vertical rhythm between sections (shared inputs,
  tabs nav, tab content).
- `Heading` atom for the page title and card headers.

### Shared inputs section (Variables + Custom Functions)

- `Grid` with two columns, one `Card` per column (Variables, Custom
  functions), matching the current side-by-side layout.
- Each `Card` uses the `header` snippet for its `Heading` + hint `Text`.
- Each **row** (one variable, one custom function) is a `Cluster` of
  `FormField`s (name/value, or name/params/expr) plus a `Button
  variant="ghost"` "−" remove button. `FormField` provides the visible
  label per field, which the old bare-input version didn't have.
- "+ variable" / "+ function" buttons become `Button variant="secondary"`.
- The "used vars" badges (blue pills showing which vars a custom fn
  references) become `Tag` atoms inside a `Cluster`.

### Tabs

`Tabs` / `TabList` / `Tab` / `TabPanel` (molecules/navigation) replace the
hand-rolled tab-button `<nav>`, with `defaultValue="evaluate"`.

### Evaluate tab

- `Grid` preserving the current 2/3 + 1/3 split, two `Card`s.
- Left card: formula `FormField` (`as="input"`) + `Button
  variant="primary"` "Evaluate". Result rendered as `AlertBanner` —
  `variant="success"` with the value, `variant="error"` with the message
  — replacing the raw result `<div>`. Below a divider: "Save as function"
  mini-form (`FormField` + `Button variant="secondary"`).
- Right card: built-in function reference as a `Table` /
  `TableHeader`/`TableBody`/`TableRow`/`TableCell`, with a small `Button
  variant="ghost"` "insert" per row.

### Stepper tab

- One `Card` containing the rule-row list: `Select` atom for the variable
  dropdown (with the existing "+ new variable" inline-add flow preserved),
  `FormField`s for inc/div, `Button variant="ghost"` up/down/remove.
- `FormField` (`type="number"`) for step count + `Button
  variant="primary"` "Run".
- Results: timeline as `Table`/`TableHead`/`TableRow`/`TableCell`; final
  result as `AlertBanner variant="success"`; error as `AlertBanner
  variant="error"`.

### State/logic

Unchanged. This is a template-only rewrite — all `$state`, derived values,
and calls into `$lib/formula` stay as they are today (including the
custom-function `params` field added in the prior session).

### Testing

No unit tests currently cover `+page.svelte` (Playwright e2e only covers the
SvelteKit starter demo page). Verification is manual: start the dev server,
exercise add/remove/reorder for variables, rules, and custom functions
(including params), run the stepper, evaluate a formula, save a formula as a
function, and confirm both success and error states render via
`AlertBanner`.

## Risks / open questions

- Removing Tailwind's `@tailwindcss/forms` plugin means native form control
  styling (checkboxes, selects, etc.) reverts to the browser default unless
  the design-system atoms already override it — they do (`Select`, `Input`,
  `Checkbox`, `Radio` all have their own `<style>` blocks), so this is
  covered by construction, not by an explicit shim.
- The Windows-native `lightningcss` binding issue (pre-existing, tracked
  separately) may still block `svelte-check`/`vitest` in this environment;
  verification here relies on manual browser testing via the dev server
  rather than `pnpm check`.
