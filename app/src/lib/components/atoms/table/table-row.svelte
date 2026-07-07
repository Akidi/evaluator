<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLTableRowElement> {
    children: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<tr data-component="table-row" {...rest}>
  {@render children()}
</tr>

<style>
  [data-component='table-row'] {
    transition: background var(--duration-fast) var(--ease-default);
  }
</style>
