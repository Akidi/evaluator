<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLTableElement> {
    children: Snippet;
    caption?: string;
  }

  let { children, caption, ...rest }: Props = $props();
</script>

<div data-component="table-wrapper">
  <table data-component="table" {...rest}>
    {#if caption}<caption>{caption}</caption>{/if}
    {@render children()}
  </table>
</div>

<style>
  [data-component='table-wrapper'] {
    width: 100%;
    overflow-x: auto;
  }

  [data-component='table'] {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--table-font-size, var(--text-sm));
    color: var(--text);
  }

  [data-component='table'] caption {
    padding: var(--space-2) var(--space-3);
    text-align: left;
    font-weight: var(--font-semibold);
    color: var(--text-muted);
  }
</style>
