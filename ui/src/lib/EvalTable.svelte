<script lang="ts">
	import { Table } from '@wildmuse/ui';
	import type { Row, TableHeaders } from './types';
	import type { Snippet } from 'svelte';

	interface Props {
		headers: TableHeaders;
		rows: Row[];
    rowSnippet: Snippet
	}

	let {headers, rows, rowSnippet }: Props = $props();
</script>

<Table>
	{#if headers}
		<thead>
			<tr>
				{#each headers as h(h)}
					<th scope="col">{h}</th>
				{/each}
			</tr>
		</thead>
	{/if}
	<tbody>
		{#each rows as row (row.id)}
      <tr>{@render rowSnippet(row)}</tr>
		{/each}
	</tbody>
</Table>
