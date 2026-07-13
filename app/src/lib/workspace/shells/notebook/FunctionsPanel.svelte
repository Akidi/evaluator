<script lang="ts">
	import { getWorkspace } from '$lib/workspace/workspace.svelte';
	import { BUILT_IN_FNS, getReferencedVars, getParamNames } from '$lib/formula';
	import { Card, FormField } from '$lib/components/molecules';
	import { Button, Tag, Heading } from '$lib/components/atoms';
	import { Stack, Cluster } from '$lib/components/layouts';

	const ws = getWorkspace();

	function usedVars(expr: string, params: string): string[] {
		const p = new Set(getParamNames(params));
		return getReferencedVars(expr).filter((n) => !p.has(n));
	}
</script>

<Card>
	<details data-component="functions-panel">
		<summary><Heading level={2} size="sm">Functions</Heading></summary>

		<Stack space="var(--space-3)">
			{#each ws.functions as f, i (i)}
				<Stack space="var(--space-1)">
					<Cluster space="var(--space-2)" align="flex-end">
						<div style="width: 7rem; flex-shrink: 0;">
							<FormField
								label="Name"
								placeholder="name"
								bind:value={f.name}
								onblur={ws.persistFunctions}
							/>
						</div>
						<div style="width: 7rem; flex-shrink: 0;">
							<FormField
								label="Params"
								placeholder="x, y"
								bind:value={f.params}
								onblur={() => {
									ws.refreshDerivedVars();
									ws.persistFunctions();
								}}
							/>
						</div>
						<div style="flex: 1; min-width: 0;">
							<FormField
								label="Expression"
								placeholder="e.g. 80 + floor(pow(level, 1.6))"
								bind:value={f.expr}
								onblur={() => {
									ws.refreshDerivedVars();
									ws.persistFunctions();
								}}
							/>
						</div>
						<Button
							variant="ghost"
							onclick={() => ws.removeFunction(i)}
							aria-label="Remove function">−</Button
						>
					</Cluster>
					{#if f.expr.trim() !== ''}
						{@const vars = usedVars(f.expr, f.params)}
						{#if vars.length > 0}
							<Cluster space="var(--space-1)">
								{#each vars as name (name)}<Tag variant="primary">{name}</Tag>{/each}
							</Cluster>
						{/if}
					{/if}
				</Stack>
			{/each}
			<Button variant="secondary" onclick={ws.addFunction}>+ function</Button>

			<Heading level={3} size="xs">Built-ins</Heading>
			<Cluster space="var(--space-1)">
				{#each BUILT_IN_FNS as fn (fn.name)}
					<Tag>{fn.signature}</Tag>
				{/each}
			</Cluster>
		</Stack>
	</details>
</Card>

<style>
	[data-component='functions-panel'] summary {
		cursor: pointer;
		list-style: none;
	}
	[data-component='functions-panel'] summary::-webkit-details-marker {
		display: none;
	}
	[data-component='functions-panel'][open] summary {
		margin-block-end: var(--space-3);
	}
</style>
