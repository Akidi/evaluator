<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLTableSectionElement> {
    children: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<thead data-component="table-head" {...rest}>
  {@render children()}
</thead>

<style>
  /* Filled header band so the head reads as distinct from the body. */
  [data-component='table-head'] {
    background: var(--table-head-bg, var(--surface-sunken));
  }
</style>
