<script lang="ts">
	import Select from './select.svelte';

	interface Props {
		initialValue?: string;
	}

	let { initialValue = '' }: Props = $props();
	let selectedValue = $state('');

	$effect(() => {
		selectedValue = initialValue || '';
	});
</script>

<Select bind:value={selectedValue}>
	<option value="pasta">Pasta</option>
	<option value="salad">Salad</option>
</Select>

<p data-testid="bound-value">{selectedValue}</p>
