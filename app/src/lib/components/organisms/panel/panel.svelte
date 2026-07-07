<!--
  @component Panel
  Titled section container: heading row (with optional toolbar) over a body.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Box, Stack, Cluster } from '$lib/components/layouts';
  import { Heading } from '$lib/components/atoms';

  interface Props {
    title: string;
    toolbar?: Snippet;
    children: Snippet;
  }

  let { title, toolbar, children }: Props = $props();
</script>

<Box data-component="panel" padding="var(--space-4)">
  <Stack space="var(--space-3)">
    <Cluster justify="space-between" align="center">
      <Heading level={3} size="sm">{title}</Heading>
      {#if toolbar}{@render toolbar()}{/if}
    </Cluster>
    {@render children()}
  </Stack>
</Box>

<style>
  :global([data-component='panel']) {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg, 0.75rem);
    box-shadow: var(--shadow-sm);
  }
</style>
