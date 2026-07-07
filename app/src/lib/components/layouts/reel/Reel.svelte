<!--
  @component Reel

  A horizontally scrolling row of items. Items have a fixed width via `itemWidth`;
  the row scrolls when they overflow. Scrollbar is visible by default for discoverability.

  **Accessibility:** The element receives `tabindex="0"` so keyboard users can focus
  and scroll it with arrow keys.

  @prop itemWidth - Fixed width for each child item. Default: `"auto"` (items size to content)
  @prop height    - Block size of the reel container. Default: `"auto"`
  @prop space     - Gap between items. Default: `var(--space-4, 1rem)`
  @prop noBar     - Hide the scrollbar. Default: `false`
  @prop tag       - Rendered HTML element. Default: `"div"`

  @example Minimal
  <Reel>
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </Reel>

  @example itemWidth — fixed-width cards
  <Reel itemWidth="200px">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </Reel>

  @example noBar — hidden scrollbar (still scrollable)
  <Reel itemWidth="200px" noBar>
    <div>Card 1</div>
    <div>Card 2</div>
  </Reel>

  @example Typical use — media carousel
  <Reel itemWidth="240px" tag="ul">
    <li><img src="..." alt="..." /></li>
    <li><img src="..." alt="..." /></li>
  </Reel>

  @example All props
  <Reel itemWidth="180px" height="200px" space="0.5rem" noBar tag="ol">
    <li>Item 1</li>
    <li>Item 2</li>
  </Reel>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type ReelTag = 'div' | 'section' | 'article' | 'ul' | 'ol';

  interface Props {
    itemWidth?: string;
    height?: string;
    space?: string;
    noBar?: boolean;
    tag?: ReelTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let {
    itemWidth = 'auto',
    height = 'auto',
    space = 'var(--space-4, 1rem)',
    noBar = false,
    tag = 'div',
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived(
    [`--reel-item-width: ${itemWidth}`, `--reel-height: ${height}`, `--reel-space: ${space}`, style]
      .filter(Boolean)
      .join('; '),
  );
</script>

<svelte:element
  this={tag}
  data-layout="reel"
  data-no-bar={noBar ? '' : undefined}
  tabindex={0}
  style={mergedStyle}
  {...rest}
>
  {@render children()}
</svelte:element>

<style>
  :global([data-layout='reel']) {
    display: flex;
    block-size: var(--reel-height, auto);
    overflow-x: auto;
    overflow-y: hidden;
    gap: var(--reel-space, 1rem);
    scrollbar-color: var(--reel-scrollbar-color, var(--border-emphasis)) transparent;
  }

  :global([data-layout='reel'][data-no-bar]) {
    scrollbar-width: none;
  }

  :global([data-layout='reel'][data-no-bar]::-webkit-scrollbar) {
    display: none;
  }

  :global([data-layout='reel'] > *) {
    flex: 0 0 var(--reel-item-width, auto);
  }
</style>
