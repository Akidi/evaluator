<!--
  @component TabList

  Container for `Tab` components. Renders as a `role="tablist"` using the `Cluster` layout.
  Must be a direct child of `Tabs`.

  @prop label    - Accessible `aria-label` for the tablist.
  @prop children - One or more `Tab` components (required).

  @example
  <TabList label="Recipe sections">
    <Tab value="ingredients">Ingredients</Tab>
    <Tab value="steps">Steps</Tab>
  </TabList>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Cluster } from '$lib/components/layouts';

  interface Props {
    label?: string;
    children: Snippet;
  }

  let { label, children, ...rest }: Props = $props();
</script>

<Cluster
  role="tablist"
  aria-label={label}
  data-tab-list
  space="var(--space-1)"
  align="stretch"
  {...rest}
>
  {@render children()}
</Cluster>

<style>
  :global([data-tab-list]) {
    border-block-end: 1px solid var(--border);
  }
</style>
