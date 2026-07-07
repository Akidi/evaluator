<!--
  @component Cluster

  Groups inline items horizontally with consistent gap and natural wrapping.
  Items wrap to the next line when they run out of space — no breakpoints needed.
  Good for tags, button groups, breadcrumbs, and any set of items with variable widths.

  @prop space   - Gap between items. Default: `var(--space-4, 1rem)`
  @prop justify - `justify-content` value. Default: `"flex-start"`
  @prop align   - `align-items` value. Default: `"center"`
  @prop tag     - Rendered HTML element. Default: `"div"`

  @example Minimal
  <Cluster>
    <span>Tag one</span>
    <span>Tag two</span>
    <span>Tag three</span>
  </Cluster>

  @example justify — centred tag cloud
  <Cluster justify="center">
    <span>Tag one</span>
    <span>Tag two</span>
  </Cluster>

  @example Typical use — navigation links
  <Cluster tag="nav" space="var(--space-2, 0.5rem)">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </Cluster>

  @example All props
  <Cluster space="0.5rem" justify="space-between" align="flex-start" tag="ul">
    <li>Item one</li>
    <li>Item two</li>
  </Cluster>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type ClusterTag = 'div' | 'section' | 'article' | 'ul' | 'ol' | 'nav' | 'header' | 'footer';

  type Props = {
    space?: string;
    justify?: string;
    align?: string;
    tag?: ClusterTag;
    children: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children'>;

  let {
    space = 'var(--space-4, 1rem)',
    justify = 'flex-start',
    align = 'center',
    tag = 'div',
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived(
    [
      `--cluster-space: ${space}`,
      `--cluster-justify: ${justify}`,
      `--cluster-align: ${align}`,
      style ?? '',
    ]
      .filter(Boolean)
      .join('; '),
  );
</script>

<svelte:element this={tag} data-layout="cluster" style={mergedStyle} {...rest}>
  {@render children()}
</svelte:element>

<style>
  :global([data-layout='cluster']) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cluster-space, 1rem);
    justify-content: var(--cluster-justify, flex-start);
    align-items: var(--cluster-align, center);
  }
</style>
