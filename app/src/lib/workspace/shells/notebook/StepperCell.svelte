<!-- StepperCell.svelte -->
<script lang="ts">
	import { getWorkspace, newId } from '$lib/workspace/workspace.svelte';
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
		TableCell
	} from '$lib/components/atoms';
	import { Cluster, Stack } from '$lib/components/layouts';

	interface Props {
		cell: StepperCell;
	}
	let { cell }: Props = $props();

	const ws = getWorkspace();

	let outcome = $derived(runStepper(cell.rules, Math.min(cell.steps, 500), ws.variables, ws.functions));
	let series = $derived(outcome.ok ? stepperSeries(outcome.result.timeline) : []);
	let varNames = $derived(series.map((s) => s.name));

	function addRule() {
		cell.rules.push({ id: newId('rule'), variable: '', inc: '', div: '' });
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
	// rule id (stable across reorders), so the dropdown can swap to a name
	// input just for that row.
	const NEW_VAR_OPTION = '__new__';
	let addingVarForRule = $state<Set<string>>(new Set());

	function onRuleVariableSelect(i: number, id: string, value: string) {
		if (value === NEW_VAR_OPTION) {
			addingVarForRule.add(id);
			addingVarForRule = new Set(addingVarForRule);
			cell.rules[i].variable = '';
		} else {
			cell.rules[i].variable = value;
		}
	}
	function commitNewRuleVariable(i: number, id: string, name: string) {
		const trimmed = name.trim();
		if (trimmed === '') {
			cancelNewRuleVariable(id);
			return;
		}
		if (!ws.variables.some((v) => v.name.trim() === trimmed)) {
			ws.variables.push({ id: newId('var'), name: trimmed, value: '0' });
		}
		cell.rules[i].variable = trimmed;
		addingVarForRule.delete(id);
		addingVarForRule = new Set(addingVarForRule);
	}
	function cancelNewRuleVariable(id: string) {
		addingVarForRule.delete(id);
		addingVarForRule = new Set(addingVarForRule);
	}
</script>

<Card>
	<Stack space="var(--space-4)">
		<Stack space="var(--space-2)">
			{#each cell.rules as r, i (r.id)}
				<Cluster space="var(--space-2)" align="flex-end">
					<Cluster space="0" style="flex-direction: column; flex-shrink: 0;">
						<Button
							variant="ghost"
							disabled={i === 0}
							onclick={() => moveRuleUp(i)}
							aria-label="Move rule up">↑</Button
						>
						<Button
							variant="ghost"
							disabled={i === cell.rules.length - 1}
							onclick={() => moveRuleDown(i)}
							aria-label="Move rule down">↓</Button
						>
					</Cluster>

					{#if addingVarForRule.has(r.id!)}
						<div style="width: 7rem; flex-shrink: 0;">
							<FormField
								label="Variable"
								placeholder="new name"
								autofocus
								onkeydown={(e: KeyboardEvent) => {
									if (e.key === 'Enter')
										commitNewRuleVariable(i, r.id!, (e.currentTarget as HTMLInputElement).value);
									if (e.key === 'Escape') cancelNewRuleVariable(r.id!);
								}}
								onblur={(e: FocusEvent) =>
									commitNewRuleVariable(i, r.id!, (e.currentTarget as HTMLInputElement).value)}
							/>
						</div>
					{:else}
						<div style="width: 8rem; flex-shrink: 0;">
							<label class="mini"
								>variable
								<Select
									value={r.variable}
									onchange={(e) => onRuleVariableSelect(i, r.id!, e.currentTarget.value)}
								>
									<option value="" disabled>variable</option>
									{#each ws.variables as v (v.id)}
										{#if v.name.trim() !== ''}<option value={v.name.trim()}>{v.name.trim()}</option
											>{/if}
									{/each}
									<option value={NEW_VAR_OPTION}>+ new variable</option>
								</Select>
							</label>
						</div>
					{/if}

					<div style="flex: 1; min-width: 0;">
						<FormField label="Inc" placeholder="inc" bind:value={r.inc} />
					</div>
					<div style="width: 5rem;">
						<FormField label="Div" placeholder="div" bind:value={r.div} />
					</div>
					<Button variant="ghost" onclick={() => removeRule(i)} aria-label="Remove rule">−</Button>
				</Cluster>
			{/each}
			<Cluster space="var(--space-2)" align="flex-end">
				<Button variant="secondary" onclick={addRule}>+ rule</Button>
				<div style="width: 6rem;">
					<FormField label="Steps" type="number" bind:value={cell.steps} min="0" />
				</div>
				<Button variant="ghost" onclick={() => ws.removeCell(cell.id)} aria-label="Remove cell"
					>−</Button
				>
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
