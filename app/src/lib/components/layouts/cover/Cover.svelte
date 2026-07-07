<!--
  @component Cover

  Vertically centres a principal element within a minimum-height container.
  Optional header and footer children are pushed to the top and bottom edges.

  **Child order:**
  - First child (if more than one) → pinned to top
  - Middle / only child → vertically centred
  - Last child (if more than one) → pinned to bottom

  **How it works:**
  All children get `margin-block: auto`. The first and last children have their
  outer margin removed so they sit flush against the container edges.

  @prop minHeight - Minimum block size of the container. Default: `"100vh"`
  @prop space     - Padding around the container and gap between children. Default: `var(--space-4, 1rem)`
  @prop noPad     - Remove the container padding entirely. Default: `false`
  @prop tag       - Rendered HTML element. Default: `"div"`

  @example Minimal — single centred element
  <Cover>
    <p>Centred content</p>
  </Cover>

  @example noPad — centred content, no surrounding padding
  <Cover noPad>
    <p>No padding around me</p>
  </Cover>

  @example Typical use — hero section with header and footer
  <Cover minHeight="80vh" tag="section">
    <p>Header text</p>
    <h1>Centred headline</h1>
    <p>Footer text</p>
  </Cover>

  @example All props
  <Cover minHeight="60vh" space="2rem" noPad tag="main">
    <header>Top</header>
    <h1>Centre</h1>
    <footer>Bottom</footer>
  </Cover>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type CoverTag = 'div' | 'section' | 'article' | 'main';

  interface Props {
    minHeight?: string;
    space?: string;
    noPad?: boolean;
    tag?: CoverTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let {
    minHeight = '100vh',
    space = 'var(--space-4, 1rem)',
    noPad = false,
    tag = 'div',
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived(
    [`--cover-min-height: ${minHeight}`, `--cover-space: ${space}`, style]
      .filter(Boolean)
      .join('; '),
  );
</script>

<svelte:element
  this={tag}
  data-layout="cover"
  data-no-pad={noPad ? '' : undefined}
  style={mergedStyle}
  {...rest}
>
  {@render children()}
</svelte:element>

<style>
  :global([data-layout='cover']) {
    display: flex;
    flex-direction: column;
    min-block-size: var(--cover-min-height, 100vh);
    padding: var(--cover-space, 1rem);
  }

  :global([data-layout='cover'][data-no-pad]) {
    padding: 0;
  }

  :global([data-layout='cover'] > *) {
    margin-block: auto;
  }

  :global([data-layout='cover'] > :first-child:not(:only-child):not([data-cover-principal])) {
    margin-block-start: 0;
  }

  :global([data-layout='cover'] > :last-child:not(:only-child):not([data-cover-principal])) {
    margin-block-end: 0;
  }
</style>
