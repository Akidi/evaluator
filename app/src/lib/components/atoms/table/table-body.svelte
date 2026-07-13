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
  /* Quiet zebra striping on body rows. Declared before the hover rule so
     hover (equal specificity) still wins on striped rows. */
  [data-component='table-body'] :global([data-component='table-row']:nth-child(even)) {
    background: var(--table-row-stripe-bg, var(--surface-sunken));
  }

  /* Hover affects only body rows, never the header row. */
  [data-component='table-body'] :global([data-component='table-row']:hover) {
    background: var(--table-row-hover-bg, var(--surface-overlay));
  }
</style>
