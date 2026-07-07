<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLTableCellElement> {
    children: Snippet;
    scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
  }

  let { children, scope = 'col', ...rest }: Props = $props();
</script>

<th data-component="table-header" {scope} {...rest}>
  {@render children()}
</th>

<style>
  [data-component='table-header'] {
    padding: var(--space-2) var(--space-3);
    text-align: left;
    font-weight: var(--font-semibold);
    color: var(--text-muted);
    white-space: nowrap;
    border-bottom: 1px solid var(--table-border-color, var(--border));
  }
</style>
