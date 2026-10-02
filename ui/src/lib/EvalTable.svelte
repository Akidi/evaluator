<script lang="ts">
	import { Button, Checkbox, Input, Table } from '@wildmuse/ui';
	import type { Row, TableHeaders } from './types';
	import type { IPlayground } from './playground.svelte';

	interface Props {
		getRows: 'fn' | 'var';
		pg: IPlayground;
		headers: TableHeaders;
	}

	let { getRows, pg, headers = [] }: Props = $props();

	const fullHeaders = $derived(['enabled', ...headers, 'remove'].map((row) => row.toWellFormed()));

	const rows = $derived.by(() => {
		if (getRows === 'fn') return pg.fnRows;
		if (getRows === 'var') return pg.varRows;
		return [];
	});
</script>

{#snippet rowSnippet(r: Row)}
	<td class="c-active">
		<Checkbox bind:checked={r.enabled} aria-label={`Toggle ${r.name || 'variable'}`} />
	</td>
	<td>
		<Input bind:value={r.name} showIcon={false} placeholder="name" aria-label="Variable name" />
	</td>
	{#if 'value' in r}
		<td class="c-value">
			<Input
				inputType="number"
				bind:value={r.value}
				showIcon={false}
				placeholder="0"
				aria-label="Variable value"
				aria-invalid={r.enabled && !Number.isFinite(Number(r.value))}
			/>
		</td>
	{:else if 'params' in r}
		<td class="c-value">
			<Input
				bind:value={r.params}
				showIcon={false}
				aria-label="Function Parameters, comma separated"
				aria-invalid={r.enabled}
			/>
		</td>
		<td class="c-value">
			<Input bind:value={r.body} showIcon={false} aria-label="Function Body" />
		</td>
	{/if}
	<td class="c-remove">
		<Button
			variant="ghost"
			aria-label={`Remove ${r.name || 'variable'}`}
			onclick={() => {
				const id = r.id;
				pg.removeVar(id);
			}}>✕</Button
		>
	</td>
{/snippet}

<div class="eval-table">
	<Table>
		<thead>
			<tr>
				{#each fullHeaders as h (h)}
					<th scope="col">{h}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.id)}
				<tr class:is-disabled={!row.enabled}>{@render rowSnippet(row)}</tr>
			{:else}
				<tr class="is-empty">
					<td colspan={fullHeaders.length}>No rows yet — add one below.</td>
				</tr>
			{/each}
		</tbody>
	</Table>
</div>

<style>
	.eval-table {
		--et-border: var(--color-border, color-mix(in srgb, currentColor 14%, transparent));
		--et-muted: var(--color-muted, color-mix(in srgb, currentColor 60%, transparent));
		--et-accent: var(--color-accent, #6366f1);

		border: 1px solid var(--et-border);
		border-radius: 0.625rem;
		overflow: hidden;
		background: var(--color-surface, transparent);
	}

	.eval-table :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	/* Header */
	.eval-table :global(thead th) {
		position: sticky;
		top: 0;
		z-index: 1;
		text-align: left;
		padding: 0.6rem 0.75rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--et-muted);
		background: color-mix(in srgb, currentColor 5%, transparent);
		border-bottom: 1px solid var(--et-border);
		white-space: nowrap;
	}

	/* Body cells */
	.eval-table :global(tbody td) {
		padding: 0.4rem 0.6rem;
		vertical-align: middle;
		border-bottom: 1px solid color-mix(in srgb, var(--et-border) 55%, transparent);
	}

	.eval-table :global(tbody tr:last-child td) {
		border-bottom: 0;
	}

	.eval-table :global(tbody tr:nth-child(even) td) {
		background: color-mix(in srgb, currentColor 2.5%, transparent);
	}

	.eval-table :global(tbody tr:hover td) {
		background: color-mix(in srgb, var(--et-accent) 7%, transparent);
	}

	/* Disabled rows read as inactive */
	.eval-table :global(tbody tr.is-disabled td:not(.c-active)) {
		opacity: 0.45;
	}

	/* Column sizing */
	.eval-table :global(.c-active),
	.eval-table :global(.c-remove) {
		width: 1%;
		white-space: nowrap;
		text-align: center;
	}

	/* Inputs fill their cell */
	.eval-table :global(td :where(input, .field, [data-input])) {
		width: 100%;
	}

	.eval-table :global(td [aria-invalid='true']) {
		outline: 1px solid color-mix(in srgb, #ef4444 70%, transparent);
		outline-offset: 1px;
		border-radius: 0.3rem;
	}

	/* Remove button */
	.eval-table :global(.c-remove button) {
		color: var(--et-muted);
		line-height: 1;
		transition: color 0.12s ease;
	}

	.eval-table :global(.c-remove button:hover) {
		color: #ef4444;
	}

	/* Empty state */
	.eval-table :global(tr.is-empty td) {
		padding: 1.25rem 0.75rem;
		text-align: center;
		color: var(--et-muted);
		font-style: italic;
	}
</style>
