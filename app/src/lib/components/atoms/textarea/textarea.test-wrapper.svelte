<script lang="ts">
	import { untrack } from 'svelte';
	import Textarea from './textarea.svelte';

	interface Props {
		initialValue?: string;
	}

	let { initialValue = '' }: Props = $props();
	let boundValue = $state(untrack(() => initialValue));
</script>

<Textarea bind:value={boundValue} />

<p data-testid="bound-value">{boundValue}</p>
