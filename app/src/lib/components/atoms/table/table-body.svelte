<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLTableSectionElement> {
    children: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<tbody data-component="table-body" {...rest}>
  {@render children()}
</tbody>

<style>
  /* Hover affects only body rows, never the header row. */
  [data-component='table-body'] :global([data-component='table-row']:hover) {
    background: var(--table-row-hover-bg, var(--surface-overlay));
  }
</style>
