<script lang="ts">
	import { getWorkspace } from '$lib/workspace/workspace.svelte';
	import FunctionsPanel from './FunctionsPanel.svelte';
	import { FormField } from '$lib/components/molecules';
	import { Button, Heading } from '$lib/components/atoms';
	import { Stack, Cluster } from '$lib/components/layouts';

	const ws = getWorkspace();
</script>

<Stack space="var(--space-3)" data-component="scope-bar">
	<Heading level={2} size="sm">Scope</Heading>
	<Cluster space="var(--space-2)" align="flex-end">
		{#each ws.variables as v, i (i)}
			<Cluster space="var(--space-1)" align="flex-end" style="flex-wrap: nowrap;">
				<div style="width: 6rem;">
					<FormField label="Name" placeholder="name" bind:value={v.name} />
				</div>
				<div style="width: 5rem;">
					<FormField label="Value" placeholder="value" bind:value={v.value} />
				</div>
				<Button variant="ghost" onclick={() => ws.removeVariable(i)} aria-label="Remove variable"
					>−</Button
				>
			</Cluster>
		{/each}
		<Button variant="secondary" onclick={ws.addVariable}>+ var</Button>
	</Cluster>

	<FunctionsPanel />
</Stack>
