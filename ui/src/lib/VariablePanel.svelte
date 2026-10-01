<script lang="ts">
	import { Heading, Checkbox, Input, Button, FormField, Text, Table } from '@wildmuse/ui';
	import type { IPlayground } from './playground.svelte';

	interface Props {
		pg: IPlayground;
	}

	interface VarRow {
		name: string;
		value: string;
	}

	let { pg }: Props = $props();

	const defaultVar: VarRow = Object.freeze({
		name: '',
		value: ''
	});

	let newVarRow = $state<VarRow>({...defaultVar});
</script>

<section class="panel">
	<header class="panel__head">
		<Heading level={2} size="sm">Custom Variables</Heading>
		<Text as="span" size="sm" color="muted"
			>Available to every formula. Only active rows are in scope.</Text
		>
	</header>

	<Table>
		<thead>
			<tr>
				<th scope="col" class="c-active">Active</th>
				<th scope="col">Name</th>
				<th scope="col" class="c-value">Value</th>
				<th scope="col" class="c-remove"><span class="sr-only">Remove</span></th>
			</tr>
		</thead>
		<tbody>
			{#each pg.varRows as row, i (row.id)}
				<tr class:is-disabled={!row.enabled}>
					<td class="c-active">
						<Checkbox
							bind:checked={pg.varRows[i].enabled}
							aria-label={`Toggle ${row.name || 'variable'}`}
						/>
					</td>
					<td>
						<Input
							bind:value={pg.varRows[i].name}
							showIcon={false}
							placeholder="name"
							aria-label="Variable name"
						/>
					</td>
					<td class="c-value">
						<Input
							inputType="number"
							bind:value={pg.varRows[i].value}
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
				</tr>
			{:else}
				<tr>
					<td colspan="4" class="empty">
						<Text as="span" color="faint">No variables yet — add one below.</Text>
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>

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
