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

<main class="mx-auto max-w-5xl space-y-6 p-6 font-sans text-gray-900">
	<h1 class="text-2xl font-bold tracking-tight">Formula Evaluator</h1>

	<!-- Shared inputs: Variables + Custom functions -->
	<div class="grid gap-4 md:grid-cols-2">
		<section class="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<div>
				<h2 class="text-sm font-semibold text-gray-900">Variables</h2>
				<p class="text-xs text-gray-500">Shared starting values for both Evaluate and Stepper.</p>
			</div>

			<div class="space-y-2">
				{#each vars as v, i (i)}
					<div class="flex gap-2">
						<input
							class="w-0 flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
							placeholder="name"
							bind:value={v.name}
						/>
						<input
							class="w-0 flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
							placeholder="value"
							bind:value={v.value}
						/>
						<button
							class="shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
							onclick={() => removeVar(i)}
							aria-label="Remove variable"
						>
							−
						</button>
					</div>
				{/each}
				<button
					class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
					onclick={addVar}
				>
					+ variable
				</button>
			</div>
		</section>

		<section class="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<div>
				<h2 class="text-sm font-semibold text-gray-900">Custom functions</h2>
				<p class="text-xs text-gray-500">
					Functions that read live variables and can optionally take params — e.g.
					<code class="rounded bg-gray-100 px-1 py-0.5">toNextLevel</code>
					with params <code class="rounded bg-gray-100 px-1 py-0.5">level</code> =
					<code class="rounded bg-gray-100 px-1 py-0.5">80 + floor(pow(level, 1.6))</code>. Also
					doubles as your saved formulas — hit "load" to put one back in the formula box.
				</p>
			</div>

			<div class="space-y-2">
				{#each customFns as f, i (i)}
					<div class="space-y-1">
						<div class="flex gap-2">
							<input
								class="w-24 shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
								placeholder="name"
								bind:value={f.name}
								onblur={persistCustomFns}
							/>
							<input
								class="w-24 shrink-0 rounded-md border border-gray-300 px-2 py-1.5 font-mono text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
								placeholder="params, e.g. x, y"
								bind:value={f.params}
								onblur={onCustomFnExprChange}
							/>
							<input
								class="w-0 flex-1 rounded-md border border-gray-300 px-2 py-1.5 font-mono text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
								placeholder="e.g. 80 + floor(pow(level, 1.6))"
								bind:value={f.expr}
								onblur={onCustomFnExprChange}
							/>
							<button
								class="shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
								onclick={() => loadCustomFn(f.expr)}
								disabled={f.expr.trim() === ''}
							>
								load
							</button>
							<button
								class="shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
								onclick={() => removeCustomFn(i)}
								aria-label="Remove function"
							>
								−
							</button>
						</div>
						{#if f.expr.trim() !== ''}
							{@const paramNames = new Set(getParamNames(f.params))}
							{@const usedVars = getReferencedVars(f.expr).filter((n) => !paramNames.has(n))}
							{#if usedVars.length > 0}
								<div class="flex flex-wrap gap-1 pl-0.5">
									{#each usedVars as name (name)}
										<span class="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
											>{name}</span
										>
									{/each}
								</div>
							{/if}
						{/if}
					</div>
				{/each}
				<button
					class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
					onclick={addCustomFn}
				>
					+ function
				</button>
			</div>
		</section>
	</div>

	<!-- Tabs -->
	<div class="border-b border-gray-200">
		<nav class="-mb-px flex gap-6" aria-label="Tabs">
			<button
				class={`border-b-2 px-1 pb-2 text-sm font-medium ${
					activeTab === 'evaluate'
						? 'border-gray-900 text-gray-900'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
				}`}
				onclick={() => (activeTab = 'evaluate')}
			>
				Evaluate
			</button>
			<button
				class={`border-b-2 px-1 pb-2 text-sm font-medium ${
					activeTab === 'stepper'
						? 'border-gray-900 text-gray-900'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
				}`}
				onclick={() => (activeTab = 'stepper')}
			>
				Stepper
			</button>
		</nav>
	</div>

	{#if activeTab === 'evaluate'}
		<div class="grid gap-4 md:grid-cols-3">
			<!-- Formula + result -->
			<section class="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:col-span-2">
				<h2 class="text-sm font-semibold text-gray-900">Formula</h2>

				<div class="flex gap-2">
					<input
						class="w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
						placeholder="e.g. pow(x, 2) + 1"
						bind:value={formula}
						onkeydown={(e) => e.key === 'Enter' && doEvaluate()}
					/>
					<button
						class="shrink-0 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
						onclick={doEvaluate}
					>
						Evaluate
					</button>
				</div>

				{#if result}
					<div class="rounded-md bg-gray-50 px-3 py-2 font-mono text-sm">
						{#if result.ok}
							<span class="text-emerald-700">= {String(result.value)}</span>
						{:else}
							<span class="text-red-600">{result.error}</span>
						{/if}
					</div>
				{/if}

				<div class="space-y-2 border-t border-gray-100 pt-3">
					<h3 class="text-xs font-semibold text-gray-500 uppercase">Save as function</h3>
					<div class="flex gap-2">
						<input
							class="w-0 flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
							placeholder="name"
							bind:value={saveName}
							onkeydown={(e) => e.key === 'Enter' && saveFormulaAsCustomFn()}
						/>
						<button
							class="shrink-0 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
							onclick={saveFormulaAsCustomFn}
						>
							Save current
						</button>
					</div>
					<p class="text-xs text-gray-500">
						Saves the formula above into <strong>Custom functions</strong> under this name.
					</p>
				</div>
			</section>

			<!-- Built-in functions reference -->
			<section class="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
				<h2 class="text-sm font-semibold text-gray-900">Built-in functions</h2>
				<ul class="divide-y divide-gray-100 rounded-md border border-gray-200">
					{#each BUILT_IN_FNS as fn (fn.name)}
						<li class="flex items-center justify-between gap-2 px-3 py-1.5">
							<span class="font-mono text-xs">{fn.signature}</span>
							<button
								class="shrink-0 rounded border border-gray-300 px-2 py-0.5 text-xs hover:bg-gray-50"
								onclick={() => insertFn(fn.name, fn.arity)}
							>
								insert
							</button>
						</li>
					{/each}
				</ul>
			</section>
		</div>
	{:else}
		<section class="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<div>
				<h2 class="text-sm font-semibold text-gray-900">Stepper</h2>
				<p class="text-xs text-gray-500">
					Each rule advances a variable (starting from its value in Variables) by
					<code class="rounded bg-gray-100 px-1 py-0.5">inc</code> every
					<code class="rounded bg-gray-100 px-1 py-0.5">div</code> steps.
				</p>
			</div>

			<div class="space-y-2">
				{#each rules as r, i (i)}
					<div class="flex items-center gap-2">
						<div class="flex shrink-0 flex-col gap-0.5">
							<button
								class="rounded border border-gray-300 px-1 text-xs leading-none hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
								disabled={i === 0}
								onclick={() => moveRuleUp(i)}
								aria-label="Move rule up"
							>
								↑
							</button>
							<button
								class="rounded border border-gray-300 px-1 text-xs leading-none hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
								disabled={i === rules.length - 1}
								onclick={() => moveRuleDown(i)}
								aria-label="Move rule down"
							>
								↓
							</button>
						</div>
						{#if addingVarForRule.has(i)}
							<input
								class="w-28 shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
								placeholder="new name"
								autofocus
								onkeydown={(e) => {
									if (e.key === 'Enter') commitNewRuleVariable(i, e.currentTarget.value);
									if (e.key === 'Escape') cancelNewRuleVariable(i);
								}}
								onblur={(e) => commitNewRuleVariable(i, e.currentTarget.value)}
							/>
						{:else}
							<select
								class="w-28 shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
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
							</select>
						{/if}
						<input
							class="w-0 flex-1 rounded-md border border-gray-300 px-2 py-1.5 font-mono text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
							placeholder="inc"
							bind:value={r.inc}
						/>
						<input
							class="w-20 shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
							placeholder="div"
							bind:value={r.div}
						/>
						<button
							class="shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
							onclick={() => removeRule(i)}
							aria-label="Remove rule"
						>
							−
						</button>
					</div>
				{/each}
				<button
					class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
					onclick={addRule}
				>
					+ rule
				</button>
			</div>

			<div class="flex items-center gap-3 border-t border-gray-100 pt-4">
				<label class="flex items-center gap-2 text-sm text-gray-700">
					steps
					<input
						type="number"
						class="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
						bind:value={steps}
						min="0"
					/>
				</label>
				<button
					class="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
					onclick={doStep}
				>
					Run
				</button>
			</div>

			{#if stepResult}
				{#if stepResult.ok}
					<div class="overflow-x-auto rounded-md border border-gray-200">
						<table class="w-full text-sm">
							<thead>
								<tr class="bg-gray-50">
									<th class="border-b border-gray-200 px-3 py-1.5 text-left font-medium text-gray-500"
										>step</th
									>
									{#each varNames as name (name)}
										<th
											class="border-b border-gray-200 px-3 py-1.5 text-left font-medium text-gray-500"
											>{name}</th
										>
									{/each}
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100">
								{#each stepResult.result.timeline as snap (snap.step)}
									<tr>
										<td class="px-3 py-1.5 text-gray-500">{snap.step}</td>
										{#each varNames as name (name)}
											<td class="px-3 py-1.5 font-mono">{snap.vars[name]}</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<p class="font-mono text-sm text-emerald-700">
						final: {JSON.stringify(stepResult.result.final)}
					</p>
				{:else}
					<p class="rounded-md bg-gray-50 px-3 py-2 font-mono text-sm text-red-600">
						{stepResult.error}
					</p>
				{/if}
			{/if}
		</section>
	{/if}
</main>
