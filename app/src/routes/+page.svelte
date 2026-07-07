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

	// --- Shared variables (used by both the evaluator and the stepper) ---
	let vars = $state<VarRow[]>([{ name: '', value: '' }]);

	function addVar() {
		vars.push({ name: '', value: '' });
	}
	function removeVar(i: number) {
		vars.splice(i, 1);
	}

	// --- Custom functions (used by both the evaluator and the stepper, and
	// loadable into the Evaluate formula box — a saved formula IS a function). ---
	const CUSTOM_FNS_STORAGE_KEY = 'formula.customFns';
	let customFns = $state<CustomFnRow[]>([{ name: '', expr: '', params: '' }]);

	onMount(() => {
		const raw = localStorage.getItem(CUSTOM_FNS_STORAGE_KEY);
		if (raw) {
			const parsed: Partial<CustomFnRow>[] = JSON.parse(raw);
			customFns = parsed.map((f) => ({ name: f.name ?? '', expr: f.expr ?? '', params: f.params ?? '' }));
		}
	});
	function persistCustomFns() {
		const toSave = customFns.filter((f) => f.name.trim() !== '' && f.expr.trim() !== '');
		localStorage.setItem(CUSTOM_FNS_STORAGE_KEY, JSON.stringify(toSave));
	}
	function addCustomFn() {
		customFns.push({ name: '', expr: '', params: '' });
	}
	function removeCustomFn(i: number) {
		customFns.splice(i, 1);
		persistCustomFns();
	}
	function onCustomFnExprChange() {
		fillMissingVarsForCustomFns(vars, customFns);
		persistCustomFns();
	}
	function loadCustomFn(expr: string) {
		formula = expr;
	}

	// --- Evaluator ---
	let formula = $state('');
	let result = $state<EvalResult | null>(null);
	let saveName = $state('');

	function doEvaluate() {
		if (formula.trim() === '') return;
		result = evaluate(formula, vars, customFns);
	}
	function insertFn(name: string, arity: number = 0) {
		formula += `${name}(${Array(arity).fill('').join(', ')})`;
	}
	function saveFormulaAsCustomFn() {
		const name = saveName.trim();
		const expr = formula.trim();
		if (name === '' || expr === '') return;
		const existing = customFns.find((f) => f.name.trim() === name);
		if (existing) existing.expr = expr;
		else customFns.push({ name, expr, params: '' });
		fillMissingVarsForCustomFns(vars, customFns);
		persistCustomFns();
		saveName = '';
	}

	// --- Stepper ---
	let rules = $state<RuleRow[]>([{ variable: '', inc: '', div: '' }]);
	let steps = $state(5);
	let stepResult = $state<StepperResult | null>(null);

	function addRule() {
		rules.push({ variable: '', inc: '', div: '' });
	}
	function removeRule(i: number) {
		rules.splice(i, 1);
	}
	function moveRuleUp(i: number) {
		if (i === 0) return;
		[rules[i - 1], rules[i]] = [rules[i], rules[i - 1]];
	}
	function moveRuleDown(i: number) {
		if (i === rules.length - 1) return;
		[rules[i], rules[i + 1]] = [rules[i + 1], rules[i]];
	}
	function doStep() {
		stepResult = runStepper(rules, steps, vars, customFns);
	}

	// Tracks which rule rows are mid-flow adding a brand new variable, keyed by
	// rule index, so the dropdown can swap to a name input just for that row.
	const NEW_VAR_OPTION = '__new__';
	let addingVarForRule = $state<Set<number>>(new Set());

	function onRuleVariableSelect(i: number, value: string) {
		if (value === NEW_VAR_OPTION) {
			addingVarForRule.add(i);
			addingVarForRule = new Set(addingVarForRule);
			rules[i].variable = '';
		} else {
			rules[i].variable = value;
		}
	}
	function commitNewRuleVariable(i: number, name: string) {
		const trimmed = name.trim();
		if (trimmed === '') {
			cancelNewRuleVariable(i);
			return;
		}
		if (!vars.some((v) => v.name.trim() === trimmed)) {
			vars.push({ name: trimmed, value: '0' });
		}
		rules[i].variable = trimmed;
		addingVarForRule.delete(i);
		addingVarForRule = new Set(addingVarForRule);
	}
	function cancelNewRuleVariable(i: number) {
		addingVarForRule.delete(i);
		addingVarForRule = new Set(addingVarForRule);
	}

	let varNames = $derived(
		stepResult?.ok ? Object.keys(stepResult.result.timeline[0]?.vars ?? {}) : []
	);

	// --- Tabs ---
	let activeTab = $state<'evaluate' | 'stepper'>('evaluate');
</script>

<PageShell tag="main">
	<Stack space="var(--space-6)">
		<Heading level={1} size="2xl">Formula Evaluator</Heading>

		<Grid min="420px" space="var(--space-4)">
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
							<Cluster space="var(--space-2)" align="flex-end">
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
