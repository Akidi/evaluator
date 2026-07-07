<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLTableCellElement> {
    children: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<td data-component="table-cell" {...rest}>
  {@render children()}
</td>

<style>
  [data-component='table-cell'] {
    padding: var(--space-2) var(--space-3);
    vertical-align: middle;
    border-bottom: 1px solid var(--table-border-color, var(--border));
  }
</style>
