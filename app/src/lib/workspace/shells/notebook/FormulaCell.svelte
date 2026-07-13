<!-- FormulaCell.svelte -->
<script lang="ts">
	import { untrack } from 'svelte';
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

	let debouncedExpr = $state(untrack(() => cell.expr));
	let timer: ReturnType<typeof setTimeout>;
	$effect(() => {
		const next = cell.expr;
		clearTimeout(timer);
		timer = setTimeout(() => (debouncedExpr = next), 120);
		return () => clearTimeout(timer);
	});

	let result = $derived(
		debouncedExpr.trim() === '' ? null : evaluate(debouncedExpr, ws.variables, ws.functions)
	);
	let refs = $derived(getReferencedVars(debouncedExpr));

	// Resolve which variable to sweep + a default 1..20 range.
	// A previously-picked cell.xVar is only trusted while it's still referenced
	// by the current formula; once an edit drops it from `refs`, fall back to
	// defaultXVar (which may itself be undefined for 0 or 2+ referenced vars)
	// rather than keep sweeping an orphaned variable.
	let effectiveXVar = $derived(
		cell.xVar && refs.includes(cell.xVar) ? cell.xVar : defaultXVar(debouncedExpr)
	);
	let xRange = $derived(cell.xRange ?? { min: 1, max: 20 });
	let curve = $derived(
		effectiveXVar ? sweepFormula(debouncedExpr, ws.variables, ws.functions, effectiveXVar, xRange) : []
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
		<FormField
			label="Formula"
			placeholder="e.g. 80 + floor(pow(level, 1.6))"
			bind:value={cell.expr}
			style="font-family: var(--font-mono)"
		/>

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

		{#if effectiveXVar && curve.length > 0}
			<LineChart series={[{ name: cell.expr, points: curve }]} fillArea xLabel={effectiveXVar} />
		{/if}

		{#if refs.length > 0}
			<Cluster space="var(--space-2)" align="flex-end" style="flex-wrap: nowrap;">
				<div style="width: 7rem;">
					<label class="mini"
						>sweep
						<Select bind:value={cell.xVar}>
							{#each refs as name (name)}<option value={name} selected={name === effectiveXVar}
									>{name}</option
								>{/each}
						</Select>
					</label>
				</div>
				<div style="width: 5rem;">
					<FormField
						label="min"
						type="number"
						value={xRange.min}
						oninput={(e) => (cell.xRange = { min: Number(e.currentTarget.value), max: xRange.max })}
					/>
				</div>
				<div style="width: 5rem;">
					<FormField
						label="max"
						type="number"
						value={xRange.max}
						oninput={(e) => (cell.xRange = { min: xRange.min, max: Number(e.currentTarget.value) })}
					/>
				</div>
			</Cluster>
		{/if}

		<Cluster space="var(--space-2)" align="flex-end" style="flex-wrap: nowrap;">
			<div style="flex: 1; min-width: 0;">
				<FormField
					label="Save as function"
					placeholder="name"
					bind:value={saveName}
					onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && saveAsFunction()}
				/>
			</div>
			<Button variant="secondary" onclick={saveAsFunction}>Save</Button>
			<Button variant="ghost" onclick={() => ws.removeCell(cell.id)} aria-label="Remove cell"
				>−</Button
			>
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
