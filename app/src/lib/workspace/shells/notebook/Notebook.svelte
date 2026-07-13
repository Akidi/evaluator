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
							<Button
								variant="ghost"
								onclick={() => ws.moveCell(cell.id, -1)}
								aria-label="Move cell up">↑</Button
							>
							<Button
								variant="ghost"
								onclick={() => ws.moveCell(cell.id, 1)}
								aria-label="Move cell down">↓</Button
							>
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
