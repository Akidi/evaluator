<script lang="ts">
	import { type EvalFn, type FnEntry, Formulate, type Scope } from '@formula/core';
	import {
		Input,
		LabeledValue,
		Button,
		Heading,
		Checkbox,
		Table,
		Text,
		FormField,
	} from '@wildmuse/ui';

	type ScopeRow = { id: string; name: string; value: string; enabled: boolean };
	type ScopeFnRow = { id: string; name: string; params: string; body: string; enabled: boolean };

	const formulate = new Formulate();
	let formula = $state('');
	let result = $state();
	let error = $state('');
	let varRows = $state<ScopeRow[]>([]);
	let fnRows = $state<ScopeFnRow[]>([]);
	let defaultVarRow = {
		name: '',
		value: ''
	};
	let defaultFnRow = {
		name: '',
		body: '',
		params: ''
	};
	let newVarRow = $state({...defaultVarRow});
	let newFnRow = $state({...defaultFnRow});
	let varScope = $derived<Map<string, number>>(
		new Map(varRows.filter((row) => row.enabled).map((row) => [row.name, Number(row.value)]))
	);
	let fnScope = $derived<Map<string, FnEntry>>(
		new Map(
			fnRows
				.filter((row) => row.enabled)
				.map((row): [string, FnEntry] => {
          const params = row.params.split(',').filter(Boolean).map(name => name.trim());
					const fn: EvalFn = (...args) =>
						formulate.run(
							row.body,
							new Map<string, number | FnEntry>([
                ...varScope,
                ...params.map((name, i): [string, number] => [name, args[i]]),
							])
						);
					return [row.name, { fn, arity: params.length }];
				})
		)
	);
	let scope = $derived<Scope>(new Map<string, number | FnEntry>([...varScope, ...fnScope]));
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
			{#each varRows as row, i (row.id)}
				<tr class:is-disabled={!row.enabled}>
					<td class="c-active">
						<Checkbox
							bind:checked={varRows[i].enabled}
							aria-label={`Toggle ${row.name || 'variable'}`}
						/>
					</td>
					<td>
						<Input
							bind:value={varRows[i].name}
							showIcon={false}
							placeholder="name"
							aria-label="Variable name"
						/>
					</td>
					<td class="c-value">
						<Input
							inputType="number"
							bind:value={varRows[i].value}
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
								varRows = varRows.filter((r) => r.id !== id);
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
		class="add"
		onsubmit={(e) => {
			e.preventDefault();
			if (newVarRow.name.trim() === '') return;
			varRows = [...varRows, { id: crypto.randomUUID(), enabled: true, ...newVarRow }];
			newVarRow = {...defaultVarRow};
		}}
	>
		<FormField label="Name" bind:value={newVarRow.name} placeholder="e.g. LEVEL" />
		<FormField label="Value" type="number" bind:value={newVarRow.value} placeholder="e.g. 5" />
		<Button type="submit" variant="primary" disabled={newVarRow.name.trim() === ''}
			>Add variable</Button
		>
	</form>
</section>

<section class="panel">
	<Table>
		<caption><Heading level={3}>Custom Functions</Heading></caption>
		<thead>
			<tr>
				<td>Active</td>
				<td>Name</td>
				<td>Params</td>
				<td>Body</td>
				<td>Remove</td>
			</tr>
		</thead>
		<tbody>
			{#each fnRows as row, i (row.id)}
				<tr class:is-disabled={!row.enabled}>
					<td class="c-active">
						<Checkbox
							bind:checked={fnRows[i].enabled}
							aria-label={`Toggle ${row.name || 'function'}`}
						/>
					</td>
					<td>
						<Input
							bind:value={fnRows[i].name}
							showIcon={false}
							placeholder="name"
							aria-label="Function name"
						/>
					</td>
					<td class="c-value">
						<Input
							bind:value={fnRows[i].params}
							showIcon={false}
							aria-label="Function Parameters, comma separated"
							aria-invalid={row.enabled}
						/>
					</td>
          <td class="c-value">
            <Input
              bind:value={fnRows[i].body}
              showIcon={false}
              aria-label="Function Body"
            />
          </td>
					<td class="c-remove">
						<Button
							variant="ghost"
							aria-label={`Remove ${row.name || 'variable'}`}
							onclick={() => {
								const id = row.id;
								fnRows = fnRows.filter((r) => r.id !== id);
							}}>✕</Button
						>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="4" class="empty">
						<Text as="span" color="faint">No Functions yet — add one below.</Text>
					</td>
				</tr>
			{/each}
			<tr>
				<td>Active</td>
				<td>Name</td>
				<td>Params</td>
				<td>Body</td>
				<td>Remove</td>
			</tr>
		</tbody>
	</Table>
	<form
		class="add"
		onsubmit={(e) => {
			e.preventDefault();
			if (newFnRow.name.trim() === '') return;
			fnRows = [...fnRows, { id: crypto.randomUUID(), enabled: true, ...newFnRow }];
			newFnRow = {...defaultFnRow};
		}}
	>
		<FormField label="Name" bind:value={newFnRow.name} placeholder="e.g. LEVEL" />
		<FormField label="Params" bind:value={newFnRow.params} placeholder="DEX, STR, x, y" />
		<FormField label="Function Body" bind:value={newFnRow.body} />
		<Button type="submit" variant="primary" disabled={newFnRow.name.trim() === ''}
			>Add Function</Button
		>
	</form>
</section>
<LabeledValue label="Input formula">
	<Input bind:value={formula} />
</LabeledValue>
<Button
	onclick={() => {
		error = '';
		try {
			result = formulate.run(formula, scope);
		} catch (e: unknown) {
			error = String(e);
		}
	}}
	>Submit
</Button>
<Heading level={2}>
	{#if error != ''}
		Error: {error}
	{:else if error == '' && result != ''}
		Result: {result}
	{:else}
		Type a formula above.
	{/if}
</Heading>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 44rem;
		margin-block: var(--space-6) var(--space-8);
	}

	.panel__head {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.panel :global(table) {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.panel th,
	.panel td {
		padding: var(--space-2) var(--space-3);
		text-align: left;
		vertical-align: middle;
	}

	.panel th {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-muted);
		background: var(--surface-sunken);
		border-bottom: 1px solid var(--border);
	}

	.panel tbody tr + tr {
		border-top: 1px solid var(--border);
	}

	.panel tbody tr.is-disabled {
		opacity: 0.55;
	}

	.panel .c-active {
		width: 5rem;
		text-align: center;
	}
	.panel .c-value {
		width: 10rem;
	}
	.panel .c-remove {
		width: 3.5rem;
		text-align: right;
	}

	.panel td :global(input:not([type='checkbox'])) {
		width: 100%;
	}

	.panel .empty {
		text-align: center;
		padding-block: var(--space-6);
	}

	.add {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: var(--space-3);
		align-items: end;
		padding: var(--space-4);
		background: var(--surface-sunken);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
	}

	@media (max-width: 34rem) {
		.add {
			grid-template-columns: 1fr;
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}
</style>
