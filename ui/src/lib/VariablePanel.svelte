<script lang="ts">
	import { Heading, Checkbox, Input, Button, FormField, Text, Table } from '@wildmuse/ui';
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
	const headers = ["enabled", "name", "value"];

	let newVarRow = $state<VarRow>({...defaultVar});
</script>

<section class="panel">
	<header class="panel__head">
		<Heading level={2} size="sm">Custom Variables</Heading>
		<Text as="span" size="sm" color="muted"
			>Available to every formula. Only active rows are in scope.</Text
		>
	</header>

<EvalTable {headers} rows={pg.varRows}>
{#snippet rowSnippet(r: VarRow)}
	<td class="c-active">
		<Checkbox
							bind:checked={r.enabled}
							aria-label={`Toggle ${row.name || 'variable'}`}
						/>
					</td>
					<td>
						<Input
							bind:value={r.name}
							showIcon={false}
							placeholder="name"
							aria-label="Variable name"
						/>
					</td>
					<td class="c-value">
						<Input
							inputType="number"
							bind:value={r.value}
							showIcon={false}
							placeholder="0"
							aria-label="Variable value"
							aria-invalid={row.enabled && !Number.isFinite(Number(row.value))}
						/>
					</td>
					<td class="c-remove">
						<Button
							variant="ghost"
							aria-label={`Remove ${row.name || 'variable'}`}
							onclick={() => {
								const id = row.id;
                pg.removeVar(id);
							}}>✕</Button
						>
					</td>
					{/snippet}
				</EvalTable>
					
					<form
		onsubmit={(e) => {
			e.preventDefault();
			pg.addVar(newVarRow.name, newVarRow.value);
			newVarRow = {...defaultVar};
		}}
	>
		<FormField label="Name" bind:value={newVarRow.name} placeholder="e.g. LEVEL" />
		<FormField label="Value" type="number" bind:value={newVarRow.value} placeholder="e.g. 5" />
		<Button type="submit" variant="primary" disabled={newVarRow.name.trim() === ''}
			>Add variable</Button
		>
	</form>
</section>
