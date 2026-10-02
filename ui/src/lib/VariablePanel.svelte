<script lang="ts">
	import { Heading, Button, FormField, Text } from '@wildmuse/ui';
	import type { IPlayground } from './playground.svelte';
	import EvalTable from './EvalTable.svelte';

	interface Props {
		pg: IPlayground;
	}

	interface VarRow {
		name: string;
		value: string;
	}

	let { pg }: Props = $props();

	const defaultVar: VarRow = Object.freeze({
		kind: 'var',
		name: '',
		value: ''
	});
	const headers = ['name', 'value'];

	let newVarRow = $state<VarRow>({ ...defaultVar });
</script>

<section class="panel">
	<header class="panel__head">
		<Heading level={2} size="sm">Custom Variables</Heading>
		<Text as="span" size="sm" color="muted"
			>Available to every formula. Only active rows are in scope.</Text
		>
	</header>

	<EvalTable getRows="var" {pg} {headers} />

	<form
		class="add"
		onsubmit={(e) => {
			e.preventDefault();
			pg.addVar(newVarRow.name, newVarRow.value);
			newVarRow = { ...defaultVar };
		}}
	>
		<div class="add__fields">
			<FormField label="Name" bind:value={newVarRow.name} placeholder="e.g. LEVEL" />
			<FormField label="Value" type="number" bind:value={newVarRow.value} placeholder="e.g. 5" />
		</div>
		<Button type="submit" variant="primary" disabled={newVarRow.name.trim() === ''}
			>Add variable</Button
		>
	</form>
</section>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.panel__head {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.add {
		--add-border: var(--color-border, color-mix(in srgb, currentColor 16%, transparent));
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 0.75rem;
		padding: 0.9rem 1rem;
		border: 1px dashed var(--add-border);
		border-radius: 0.625rem;
		background: color-mix(in srgb, currentColor 3%, transparent);
	}

	.add__fields {
		flex: 1 1 18rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: 0.75rem;
	}

	.add :global(button[type='submit']) {
		flex: 0 0 auto;
	}
</style>
