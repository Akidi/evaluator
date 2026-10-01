<script lang="ts">
	import { LabeledValue, Input, Button, Heading } from "@wildmuse/ui";
	import type { IPlayground } from "./playground.svelte";

  interface Props {
    pg: IPlayground;
  }

  let { pg }: Props = $props();
</script>

<LabeledValue label="Input formula">
  <Input bind:value={pg.formula} />
</LabeledValue>
<Button
  onclick={() => pg.run()}
  >Submit
</Button>
<Heading level={2}>
  {#if pg.error != ''}
  Error: {pg.error}
  {:else if pg.error == '' && pg.result !== undefined}
  Result: {pg.result}
  {:else}
  Type a formula above.
  {/if}
</Heading>