# Remove Tailwind, Rebuild Formula Page on $lib/components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Tailwind entirely from the `app` SvelteKit workspace member and rebuild `app/src/routes/+page.svelte` using the existing `$lib/components` (atoms/layouts/molecules) library and `$lib/assets/css` token stylesheet.

**Architecture:** This is a presentation-layer-only change. No file in `app/src/lib/formula.ts`, `evaluator/`, `stepper/`, `parser/`, or `lexer/` is touched. Tailwind is removed from build config and tooling first (so there's a clean baseline with no dead Tailwind wiring), then the page is rebuilt section by section against components that already exist and are already unit-styled with CSS custom properties — no new components are created.

**Tech Stack:** SvelteKit 2 (runes mode), Vite, `$lib/components` (existing atomic design library), `$lib/assets/css` (existing token stylesheet).

## Global Constraints

- Package manager is `pnpm` — never `npm`/`npx` (root `package.json` and `app/package.json` both assume pnpm; mixing lockfiles breaks installs).
- No new components are created in `$lib/components` — only existing exports from `app/src/lib/components/atoms/index.ts`, `app/src/lib/components/layouts/index.ts`, and `app/src/lib/components/molecules/index.ts` are used.
- All logic in `+page.svelte` (the `$state`, `$derived`, and calls into `$lib/formula`) is preserved exactly as-is — only the markup/template and imports change.
- `svelte-check`/`vitest` may be blocked in this environment by a pre-existing Windows `lightningcss` native-binding issue unrelated to this work. If a task's verification command hits `Cannot find module '../lightningcss.win32-x64-msvc.node'`, note it and fall back to the dev-server/manual-browser verification described in that task — do not treat it as a task failure.

---

### Task 1: Remove Tailwind from build config and tooling

**Files:**
- Modify: `app/vite.config.ts`
- Modify: `app/package.json`
- Modify: `app/.prettierrc`
- Modify: `app/.vscode/extensions.json`
- Modify: `app/.vscode/settings.json`
- Modify: `app/AGENTS.md`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: an `app` workspace with zero Tailwind references, ready for Task 2 to wire in the replacement stylesheet.

- [ ] **Step 1: Remove the Tailwind Vite plugin**

In `app/vite.config.ts`, remove the import and the plugin registration:

```ts
// Remove this line:
import tailwindcss from '@tailwindcss/vite';
```

```ts
// In the `plugins` array, remove this entry:
    tailwindcss(),
```

The `plugins` array in `app/vite.config.ts` currently starts:
```ts
  plugins: [
    tailwindcss(),
    sveltekit({
```
It should become:
```ts
  plugins: [
    sveltekit({
```

- [ ] **Step 2: Remove Tailwind packages from package.json**

In `app/package.json`, remove these five lines from `devDependencies`:
```json
    "@tailwindcss/forms": "^0.5.11",
    "@tailwindcss/typography": "^0.5.19",
    "@tailwindcss/vite": "^4.3.0",
```
```json
    "prettier-plugin-tailwindcss": "^0.8.0",
```
```json
    "tailwindcss": "^4.3.0",
```

- [ ] **Step 3: Remove the Tailwind prettier plugin and stylesheet reference**

In `app/.prettierrc`, remove `"prettier-plugin-tailwindcss"` from the `plugins` array and remove the `"tailwindStylesheet"` key entirely:

```json
{
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100,
	"plugins": [
		"prettier-plugin-svelte"
	],
	"overrides": [
		{
			"files": "*.svelte",
			"options": {
				"parser": "svelte"
			}
		}
	]
}
```

- [ ] **Step 4: Remove the Tailwind VS Code extension recommendation and file association**

In `app/.vscode/extensions.json`, remove `"bradlc.vscode-tailwindcss"`:

```json
{
	"recommendations": [
		"svelte.svelte-vscode",
		"esbenp.prettier-vscode",
		"dbaeumer.vscode-eslint"
	]
}
```

In `app/.vscode/settings.json`, remove the `files.associations` block entirely (it only existed to make `*.css` files use the Tailwind language mode):

```json
{
}
```

- [ ] **Step 5: Update AGENTS.md add-ons list**

In `app/AGENTS.md`, remove `tailwindcss` from the add-ons list:

```markdown
- **Add-ons**: prettier, eslint, vitest, playwright, sveltekit-adapter, drizzle, better-auth, mdsvex, paraglide, storybook, mcp, experimental
```

- [ ] **Step 6: Reinstall dependencies to update the lockfile**

Run: `pnpm install`
Expected: install completes, `pnpm-lock.yaml` at the repo root no longer lists `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/forms`, `@tailwindcss/typography`, or `prettier-plugin-tailwindcss`.

If this hangs or OOMs in this environment (seen previously with a bare `pnpm install` in this repo), retry with a longer timeout; it is expected to eventually succeed since it's only removing packages, not adding new native bindings.

- [ ] **Step 7: Commit**

```bash
git add app/vite.config.ts app/package.json app/.prettierrc app/.vscode/extensions.json app/.vscode/settings.json app/AGENTS.md pnpm-lock.yaml
git commit -m "chore: remove Tailwind from the app workspace"
```

---

### Task 2: Replace layout.css with the token stylesheet

**Files:**
- Modify: `app/src/routes/layout.css`

**Interfaces:**
- Consumes: `app/src/lib/assets/css/index.css` (already exists, already chains `reset.css` → `colors.css` → `typography.css` → `spacing.css` → `layout.css` → `components.css` — no changes needed to any file under `app/src/lib/assets/css`).
- Produces: a global stylesheet with design tokens and reset available to every route, replacing Tailwind's utility classes as the styling foundation for Task 3+.

- [ ] **Step 1: Replace the Tailwind imports**

`app/src/routes/layout.css` currently contains:
```css
@import 'tailwindcss';
@plugin '@tailwindcss/forms';
@plugin '@tailwindcss/typography';
```

Replace the entire file contents with:
```css
@import '$lib/assets/css/index.css';
```

- [ ] **Step 2: Verify the app boots and loads the stylesheet**

Start the dev server (use whatever preview/dev tooling is available, e.g. the project's `dev` script) and open the root route `/`. Confirm in the browser:
- No console error about a missing `$lib/assets/css/index.css` import.
- Base typography (font, line-height) visibly differs from the browser default — confirms `reset.css`/`typography.css` loaded.

If `svelte-check`/`vitest` is available in this environment, also run:
Run: `pnpm --filter app check`
Expected: no errors related to the `layout.css` import path. (A pre-existing `lightningcss` native-binding failure is a known environment issue, not a regression from this change — if that's the only failure, treat this step as passed via the manual browser check above instead.)

- [ ] **Step 3: Commit**

```bash
git add app/src/routes/layout.css
git commit -m "feat: wire in the design-system token stylesheet, replacing Tailwind"
```

---

### Task 3: Rebuild the page skeleton, shared inputs (Variables + Custom Functions), and Tabs shell

**Files:**
- Modify: `app/src/routes/+page.svelte`

**Interfaces:**
- Consumes:
  - `app/src/lib/formula.ts` exports: `evaluate`, `runStepper`, `fillMissingVarsForCustomFns`, `getReferencedVars`, `getParamNames`, `BUILT_IN_FNS`, types `VarRow`, `RuleRow`, `CustomFnRow` (`{ name: string; expr: string; params: string }`), `EvalResult`, `StepperResult`.
  - `$lib/components/atoms`: `Heading`, `Button`, `Tag`.
  - `$lib/components/layouts`: `PageShell`, `Stack`, `Grid`, `Cluster`.
  - `$lib/components/molecules`: `Card` (props: `header`, `footer`, `media`, `children` snippets), `FormField` (props: `label`, `as`, `type`, `hint`, `error`, `required`, `value` bindable, `oninput`, `onchange`, plus forwarded attrs), `Tabs`/`TabList`/`Tab`/`TabPanel`.
- Produces: the full page skeleton (title, Variables card, Custom Functions card, tab shell with empty Evaluate/Stepper panels) that Task 4 and Task 5 fill in. All existing `$state`/`$derived`/functions in the `<script>` block are preserved verbatim from the current file — this task only replaces the `<main>...</main>` markup below the script block, plus adjusts the `<script>` block's import statement to pull in the new components.

- [ ] **Step 1: Update the script block's imports**

At the top of `app/src/routes/+page.svelte`, change:
```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import {
		evaluate,
		runStepper,
		fillMissingVarsForCustomFns,
		getReferencedVars,
		getParamNames,
		BUILT_IN_FNS,
		type VarRow,
		type RuleRow,
		type CustomFnRow,
		type EvalResult,
		type StepperResult
	} from '$lib/formula';
```
to:
```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import {
		evaluate,
		runStepper,
		fillMissingVarsForCustomFns,
		getReferencedVars,
		getParamNames,
		BUILT_IN_FNS,
		type VarRow,
		type RuleRow,
		type CustomFnRow,
		type EvalResult,
		type StepperResult
	} from '$lib/formula';
	import { Heading, Button, Tag } from '$lib/components/atoms';
	import { PageShell, Stack, Grid, Cluster } from '$lib/components/layouts';
	import { Card, FormField, Tabs, TabList, Tab, TabPanel } from '$lib/components/molecules';
```

Leave every other line in the `<script>` block (state, functions) unchanged.

- [ ] **Step 2: Replace the page skeleton and shared-inputs markup**

Replace everything from `<main class="mx-auto max-w-5xl space-y-6 p-6 font-sans text-gray-900">` down through the closing `</div>` of the Custom Functions `<section>` (i.e. through the end of the block that currently reads, up to but not including the `<!-- Tabs -->` comment) with:

```svelte
<PageShell tag="main">
	<Stack space="var(--space-6)">
		<Heading level={1} size="2xl">Formula Evaluator</Heading>

		<Grid min="320px" space="var(--space-4)">
			<Card>
				{#snippet header()}
					<Heading level={2} size="sm">Variables</Heading>
					<p style="font-size: var(--text-xs); color: var(--text-muted);">
						Shared starting values for both Evaluate and Stepper.
					</p>
				{/snippet}

				<Stack space="var(--space-2)">
					{#each vars as v, i (i)}
						<Cluster space="var(--space-2)" align="flex-end" style="flex-wrap: nowrap;">
							<div style="flex: 1; min-width: 0;">
								<FormField label="Name" placeholder="name" bind:value={v.name} />
							</div>
							<div style="flex: 1; min-width: 0;">
								<FormField label="Value" placeholder="value" bind:value={v.value} />
							</div>
							<Button variant="ghost" onclick={() => removeVar(i)} aria-label="Remove variable">
								−
							</Button>
						</Cluster>
					{/each}
					<Button variant="secondary" onclick={addVar}>+ variable</Button>
				</Stack>
			</Card>

			<Card>
				{#snippet header()}
					<Heading level={2} size="sm">Custom functions</Heading>
					<p style="font-size: var(--text-xs); color: var(--text-muted);">
						Functions that read live variables and can optionally take params — e.g.
						<code>toNextLevel</code> with params <code>level</code> =
						<code>80 + floor(pow(level, 1.6))</code>. Also doubles as your saved formulas — hit
						"load" to put one back in the formula box.
					</p>
				{/snippet}

				<Stack space="var(--space-3)">
					{#each customFns as f, i (i)}
						<Stack space="var(--space-1)">
							<Cluster space="var(--space-2)" align="flex-end" style="flex-wrap: nowrap;">
								<div style="width: 7rem; flex-shrink: 0;">
									<FormField label="Name" placeholder="name" bind:value={f.name} onblur={persistCustomFns} />
								</div>
								<div style="width: 7rem; flex-shrink: 0;">
									<FormField
										label="Params"
										placeholder="x, y"
										bind:value={f.params}
										onblur={onCustomFnExprChange}
									/>
								</div>
								<div style="flex: 1; min-width: 0;">
									<FormField
										label="Expression"
										placeholder="e.g. 80 + floor(pow(level, 1.6))"
										bind:value={f.expr}
										onblur={onCustomFnExprChange}
									/>
								</div>
								<Button
									variant="secondary"
									onclick={() => loadCustomFn(f.expr)}
									disabled={f.expr.trim() === ''}
								>
									load
								</Button>
								<Button variant="ghost" onclick={() => removeCustomFn(i)} aria-label="Remove function">
									−
								</Button>
							</Cluster>
							{#if f.expr.trim() !== ''}
								{@const paramNames = new Set(getParamNames(f.params))}
								{@const usedVars = getReferencedVars(f.expr).filter((n) => !paramNames.has(n))}
								{#if usedVars.length > 0}
									<Cluster space="var(--space-1)">
										{#each usedVars as name (name)}
											<Tag variant="primary">{name}</Tag>
										{/each}
									</Cluster>
								{/if}
							{/if}
						</Stack>
					{/each}
					<Button variant="secondary" onclick={addCustomFn}>+ function</Button>
				</Stack>
			</Card>
		</Grid>

		<!-- TASK4_EVALUATE_TAB_PLACEHOLDER -->
		<!-- TASK5_STEPPER_TAB_PLACEHOLDER -->
	</Stack>
</PageShell>
```

This step intentionally leaves two HTML-comment placeholders (`TASK4_EVALUATE_TAB_PLACEHOLDER`, `TASK5_STEPPER_TAB_PLACEHOLDER`) — Task 4 and Task 5 replace them with the real `Tabs` block. This keeps Task 3 buildable and reviewable on its own (variables/custom-functions rendering) before the tabs are wired up.

- [ ] **Step 3: Verify the page renders without errors**

Start the dev server and open `/`. Confirm:
- The page title "Formula Evaluator" renders.
- Both "Variables" and "Custom functions" cards render side by side (or stacked on narrow viewports).
- Adding a variable via "+ variable" adds a new row with Name/Value fields.
- Adding a custom function via "+ function" adds a new row with Name/Params/Expression fields, and typing an expression referencing a var (e.g. `level * 2`) shows a `Tag` for `level` below the row once you blur the field.
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add app/src/routes/+page.svelte
git commit -m "feat: rebuild page skeleton and shared inputs on the design system"
```

---

### Task 4: Rebuild the Evaluate tab

**Files:**
- Modify: `app/src/routes/+page.svelte`

**Interfaces:**
- Consumes: `Tabs`, `TabList`, `Tab`, `TabPanel` from `$lib/components/molecules`; `AlertBanner` from `$lib/components/molecules`; `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell` from `$lib/components/atoms`; existing `formula`, `result`, `saveName`, `doEvaluate`, `insertFn`, `saveFormulaAsCustomFn`, `BUILT_IN_FNS` from the script block (unchanged).
- Produces: replaces the `<!-- TASK4_EVALUATE_TAB_PLACEHOLDER -->` marker left by Task 3 with the real `Tabs` wrapper (shared by Task 5) plus the Evaluate `TabPanel` content. Task 5 fills in the Stepper `TabPanel` inside the same `Tabs` block, so this task also adds the `Tabs`/`TabList` opening structure.

- [ ] **Step 1: Add the AlertBanner and Table imports**

In the `<script>` block's import from `$lib/components/molecules`, add `AlertBanner`:
```svelte
	import { Card, FormField, Tabs, TabList, Tab, TabPanel, AlertBanner } from '$lib/components/molecules';
```
Add a new import for the table atoms:
```svelte
	import { Heading, Button, Tag, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '$lib/components/atoms';
```
(This replaces the `Heading, Button, Tag` import line from Task 3 with the extended one above — same line, more names.)

- [ ] **Step 2: Replace the placeholder with the Tabs shell + Evaluate panel**

Replace `<!-- TASK4_EVALUATE_TAB_PLACEHOLDER -->` and `<!-- TASK5_STEPPER_TAB_PLACEHOLDER -->` (both markers, together) with:

Note first: this design system's `Tabs` manages active state via `value`/`defaultValue`/`onchange` (see its `Props` — `value` is a controlled prop read by `Tabs`, not a two-way bindable), not a plain `bind:value`. Use the uncontrolled mode, driven by `onchange`, so the existing `activeTab` page-level state variable stays in sync:

```svelte
<Tabs defaultValue="evaluate" onchange={(v) => (activeTab = v as 'evaluate' | 'stepper')}>
	<TabList label="Formula sections">
		<Tab value="evaluate">Evaluate</Tab>
		<Tab value="stepper">Stepper</Tab>
	</TabList>

	<TabPanel value="evaluate">
		<Grid min="320px" space="var(--space-4)">
			<div style="grid-column: span 2;">
				<Card>
					{#snippet header()}
						<Heading level={2} size="sm">Formula</Heading>
					{/snippet}

					<Stack space="var(--space-3)">
						<Cluster space="var(--space-2)" align="flex-end" style="flex-wrap: nowrap;">
							<div style="flex: 1; min-width: 0;">
								<FormField
									label="Formula"
									placeholder="e.g. pow(x, 2) + 1"
									bind:value={formula}
									onkeydown={(e) => e.key === 'Enter' && doEvaluate()}
								/>
							</div>
							<Button variant="primary" onclick={doEvaluate}>Evaluate</Button>
						</Cluster>

						{#if result}
							{#if result.ok}
								<AlertBanner variant="success" ondismiss={() => (result = null)}>
									= {String(result.value)}
								</AlertBanner>
							{:else}
								<AlertBanner variant="error" ondismiss={() => (result = null)}>
									{result.error}
								</AlertBanner>
							{/if}
						{/if}

						<Stack space="var(--space-2)">
							<Heading level={3} size="xs">Save as function</Heading>
							<Cluster space="var(--space-2)" align="flex-end" style="flex-wrap: nowrap;">
								<div style="flex: 1; min-width: 0;">
									<FormField
										label="Name"
										placeholder="name"
										bind:value={saveName}
										onkeydown={(e) => e.key === 'Enter' && saveFormulaAsCustomFn()}
									/>
								</div>
								<Button variant="secondary" onclick={saveFormulaAsCustomFn}>Save current</Button>
							</Cluster>
							<p style="font-size: var(--text-xs); color: var(--text-muted);">
								Saves the formula above into <strong>Custom functions</strong> under this name.
							</p>
						</Stack>
					</Stack>
				</Card>
			</div>

			<Card>
				{#snippet header()}
					<Heading level={2} size="sm">Built-in functions</Heading>
				{/snippet}

				<Table>
					<TableHead>
						<TableRow>
							<TableHeader>Signature</TableHeader>
							<TableHeader>&nbsp;</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{#each BUILT_IN_FNS as fn (fn.name)}
							<TableRow>
								<TableCell><code>{fn.signature}</code></TableCell>
								<TableCell>
									<Button variant="ghost" onclick={() => insertFn(fn.name, fn.arity)}>insert</Button>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</Card>
		</Grid>
	</TabPanel>

	<!-- TASK5_STEPPER_PANEL_PLACEHOLDER -->
</Tabs>
```

- [ ] **Step 3: Verify the Evaluate tab works end to end**

Start the dev server, open `/`, and on the Evaluate tab:
- Add a variable `x = 3`.
- Type `pow(x, 2) + 1` into the Formula field, click Evaluate. Confirm a green `AlertBanner` shows `= 10`.
- Type an invalid formula (e.g. reference an undefined variable `y`), click Evaluate. Confirm a red `AlertBanner` shows the error message.
- Click "insert" next to `pow(x, y)` in the Built-in functions table. Confirm `pow(, )` is appended to the Formula field.
- Type a name into "Save current" and click it. Confirm a new row appears in the Custom Functions card (from Task 3) with that name and the current formula as its expression.
- Switch to the Stepper tab and back — confirm the Evaluate tab's state (formula text, result) is preserved (Svelte component state is preserved across tab switches since Evaluate content isn't destroyed... actually `TabPanel` only renders when active, so state living in page-level `$state` variables like `formula`/`result` persists correctly since those aren't re-initialized; only the rendered DOM under `TabPanel` mounts/unmounts). Confirm no console errors when switching tabs back and forth.

- [ ] **Step 4: Commit**

```bash
git add app/src/routes/+page.svelte
git commit -m "feat: rebuild Evaluate tab on the design system"
```

---

### Task 5: Rebuild the Stepper tab

**Files:**
- Modify: `app/src/routes/+page.svelte`

**Interfaces:**
- Consumes: `Select` from `$lib/components/atoms`; existing `rules`, `steps`, `stepResult`, `addRule`, `removeRule`, `moveRuleUp`, `moveRuleDown`, `doStep`, `addingVarForRule`, `onRuleVariableSelect`, `commitNewRuleVariable`, `cancelNewRuleVariable`, `varNames`, `NEW_VAR_OPTION`, `vars` from the script block (unchanged); `AlertBanner`, `Table`/`TableHead`/`TableBody`/`TableRow`/`TableHeader`/`TableCell` (already imported by Task 4).
- Produces: replaces the `<!-- TASK5_STEPPER_PANEL_PLACEHOLDER -->` marker left by Task 4 with the real Stepper `TabPanel`. This is the last markup task — after this, `+page.svelte` has no remaining Tailwind classes and no placeholder comments.

- [ ] **Step 1: Add the Select import**

Extend the atoms import line from Task 4 to include `Select`:
```svelte
	import { Heading, Button, Tag, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Select } from '$lib/components/atoms';
```

- [ ] **Step 2: Replace the placeholder with the Stepper panel**

Replace `<!-- TASK5_STEPPER_PANEL_PLACEHOLDER -->` with:

```svelte
<TabPanel value="stepper">
	<Card>
		{#snippet header()}
			<Heading level={2} size="sm">Stepper</Heading>
			<p style="font-size: var(--text-xs); color: var(--text-muted);">
				Each rule advances a variable (starting from its value in Variables) by
				<code>inc</code> every <code>div</code> steps.
			</p>
		{/snippet}

		<Stack space="var(--space-4)">
			<Stack space="var(--space-2)">
				{#each rules as r, i (i)}
					<Cluster space="var(--space-2)" align="flex-end" style="flex-wrap: nowrap;">
						<Cluster space="0" style="flex-direction: column; flex-shrink: 0;">
							<Button
								variant="ghost"
								disabled={i === 0}
								onclick={() => moveRuleUp(i)}
								aria-label="Move rule up"
							>
								↑
							</Button>
							<Button
								variant="ghost"
								disabled={i === rules.length - 1}
								onclick={() => moveRuleDown(i)}
								aria-label="Move rule down"
							>
								↓
							</Button>
						</Cluster>

						{#if addingVarForRule.has(i)}
							<div style="width: 7rem; flex-shrink: 0;">
								<FormField
									label="Variable"
									placeholder="new name"
									autofocus
									onkeydown={(e) => {
										if (e.key === 'Enter') commitNewRuleVariable(i, e.currentTarget.value);
										if (e.key === 'Escape') cancelNewRuleVariable(i);
									}}
									onblur={(e) => commitNewRuleVariable(i, e.currentTarget.value)}
								/>
							</div>
						{:else}
							<div style="width: 7rem; flex-shrink: 0;">
								<label style="font-size: var(--text-sm); font-weight: 500; display: flex; flex-direction: column; gap: var(--space-1);">
									Variable
									<Select
										value={r.variable}
										onchange={(e) => onRuleVariableSelect(i, e.currentTarget.value)}
									>
										<option value="" disabled>variable</option>
										{#each vars as v (v.name)}
											{#if v.name.trim() !== ''}
												<option value={v.name.trim()}>{v.name.trim()}</option>
											{/if}
										{/each}
										<option value={NEW_VAR_OPTION}>+ new variable</option>
									</Select>
								</label>
							</div>
						{/if}

						<div style="flex: 1; min-width: 0;">
							<FormField label="Inc" placeholder="inc" bind:value={r.inc} />
						</div>
						<div style="width: 5rem; flex-shrink: 0;">
							<FormField label="Div" placeholder="div" bind:value={r.div} />
						</div>
						<Button variant="ghost" onclick={() => removeRule(i)} aria-label="Remove rule">
							−
						</Button>
					</Cluster>
				{/each}
				<Button variant="secondary" onclick={addRule}>+ rule</Button>
			</Stack>

			<Cluster space="var(--space-3)" align="flex-end">
				<div style="width: 8rem;">
					<FormField label="Steps" as="input" type="number" bind:value={steps} min="0" />
				</div>
				<Button variant="primary" onclick={doStep}>Run</Button>
			</Cluster>

			{#if stepResult}
				{#if stepResult.ok}
					<Table>
						<TableHead>
							<TableRow>
								<TableHeader>step</TableHeader>
								{#each varNames as name (name)}
									<TableHeader>{name}</TableHeader>
								{/each}
							</TableRow>
						</TableHead>
						<TableBody>
							{#each stepResult.result.timeline as snap (snap.step)}
								<TableRow>
									<TableCell>{snap.step}</TableCell>
									{#each varNames as name (name)}
										<TableCell>{snap.vars[name]}</TableCell>
									{/each}
								</TableRow>
							{/each}
						</TableBody>
					</Table>
					<AlertBanner variant="success" ondismiss={() => (stepResult = null)}>
						final: {JSON.stringify(stepResult.result.final)}
					</AlertBanner>
				{:else}
					<AlertBanner variant="error" ondismiss={() => (stepResult = null)}>
						{stepResult.error}
					</AlertBanner>
				{/if}
			{/if}
		</Stack>
	</Card>
</TabPanel>
```

- [ ] **Step 3: Verify the Stepper tab works end to end**

Start the dev server, open `/`, switch to the Stepper tab:
- Click "+ rule", select "+ new variable" in the Variable dropdown, type a name (e.g. `level`) and press Enter. Confirm the row now shows `level` selected and a new `level` variable appeared in the Variables card (Task 3) with value `0`.
- Fill in `inc = 1`, `div = 1`, set Steps to `3`, click Run. Confirm a table renders with columns `step` and `level`, 4 rows (steps 0–3), and a green `AlertBanner` showing `final: {"level":3}`.
- Click the ↑/↓ buttons with 2+ rules to confirm reordering works.
- Force an error (e.g. set `div` to `0`) and click Run. Confirm a red `AlertBanner` shows the error.

- [ ] **Step 4: Confirm no Tailwind classes or placeholder comments remain**

Run: `grep -n "class=\"" app/src/routes/+page.svelte` (or equivalent search) and manually inspect any hits — remaining `class` attributes should only be ones intentionally left on raw HTML elements for structural reasons (there should be none after this task; every visual class came from Tailwind and has been replaced by a component or inline `style`).

Run: `grep -n "TASK.*PLACEHOLDER" app/src/routes/+page.svelte`
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add app/src/routes/+page.svelte
git commit -m "feat: rebuild Stepper tab on the design system"
```

---

### Task 6: Final verification pass

**Files:**
- None modified — verification only.

**Interfaces:**
- Consumes: the fully rebuilt `app/src/routes/+page.svelte` from Tasks 3–5, and the Tailwind-free config from Tasks 1–2.
- Produces: confidence that the whole page works together and that Tailwind is fully gone.

- [ ] **Step 1: Full manual walkthrough**

Start the dev server, open `/`, and in one session:
1. Add two variables (`level = 1`, `xp = 0`).
2. Add a custom function `toNextLevel` with params `l` and expression `floor(80*pow(l+1,1.6) + 2*pow(l+1,2.4)) - floor(80*pow(l,1.6) + 2*pow(l,2.4))`.
3. On the Evaluate tab, evaluate `toNextLevel(level)` — confirm a numeric result in a success `AlertBanner`.
4. On the Stepper tab, add a rule stepping `level` by `1` every `1` step, run for 5 steps — confirm the timeline table and final-result banner render.
5. Resize the browser to a narrow (mobile) width — confirm the `Grid` components reflow to a single column and nothing overflows horizontally.

- [ ] **Step 2: Confirm Tailwind is fully removed**

Run: `grep -rn "tailwind" app --include="*.ts" --include="*.json" --include="*.css" --include="*.svelte" -i`
Expected: no matches (aside from historical references inside `pnpm-lock.yaml`, which is regenerated and not hand-edited — if the lockfile still lists Tailwind packages, re-run `pnpm install` from Task 1 Step 6).

- [ ] **Step 3: Run the project test suite**

Run: `CI=true pnpm test`
Expected: same pass/fail profile as before this change (119 passing root-level tests; the pre-existing `Welcome.svelte.spec.ts` browser-mode failure is unrelated and expected). If `svelte-check`/`vitest` fails purely due to the pre-existing `lightningcss` native-binding issue, note that explicitly rather than treating it as a regression — rely on the Step 1 manual walkthrough as the source of truth for this task.

- [ ] **Step 4: Update the design spec status (optional, no commit required unless requested)**

No code changes in this step — just confirm the spec at `docs/superpowers/specs/2026-07-07-remove-tailwind-design-system-rebuild-design.md` still accurately describes what was built. If anything drifted (e.g. `Tabs` controlled/uncontrolled usage from Task 4 Step 2), that's fine to leave as an implementation detail — the spec describes intent, not exact markup.
