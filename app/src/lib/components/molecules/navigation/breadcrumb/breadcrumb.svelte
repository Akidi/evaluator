<!--
  @component Breadcrumb

  Horizontal trail of navigation links showing the current page hierarchy.
  The active item renders as plain text; ancestor items render as Link atoms.

  @prop items - Array of `{ label, href?, current? }` objects (required).
  @prop label - Accessible `aria-label` for the nav element. Default: `"Breadcrumb"`

  @example
  <Breadcrumb items={[
    { label: 'Home',    href: '/' },
    { label: 'Recipes', href: '/recipes' },
    { label: 'Spaghetti Bolognese', current: true }
  ]} />
-->
<script lang="ts">
  import { Link } from '$lib/components/atoms';
  import { Cluster } from '$lib/components/layouts';

  interface BreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
  }

  interface Props {
    items: BreadcrumbItem[];
    label?: string;
  }

  let { items, label = 'Breadcrumb' }: Props = $props();
</script>

<Cluster tag="nav" aria-label={label} data-component="breadcrumb" space="var(--space-2)">
  {#each items as item, i (i)}
    {#if item.current || !item.href}
      <span aria-current={item.current ? 'page' : undefined} data-breadcrumb-item>
        {item.label}
      </span>
    {:else}
      <Link href={item.href} data-breadcrumb-item>{item.label}</Link>
    {/if}
    {#if i < items.length - 1}
      <span aria-hidden="true" data-breadcrumb-separator>›</span>
    {/if}
  {/each}
</Cluster>

<style>
  :global([data-component='breadcrumb']) {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  :global([data-breadcrumb-item][aria-current='page']) {
    color: var(--text);
    font-weight: var(--font-medium);
  }

  :global([data-breadcrumb-separator]) {
    color: var(--text-muted);
    font-size: var(--text-sm);
    user-select: none;
  }
</style>
