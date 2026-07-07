<!--
  @component Grid

  Creates a responsive auto-filling grid using `minmax`. Columns are added
  and removed automatically as space allows — no breakpoints needed.
  Each column is at least `min` wide; they grow equally to fill the row.

  **How it works:**
  Uses `grid-template-columns: repeat(auto-fill, minmax(min(min, 100%), 1fr))`.
  The `min()` prevents a single column from overflowing its container when
  the container is narrower than `min`.

  @prop min   - Minimum column width. Default: `"250px"`
  @prop space - Gap between cells. Default: `var(--space-4, 1rem)`
  @prop tag   - Rendered HTML element. Default: `"div"`

  @example Minimal
  <Grid>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </Grid>

  @example min — wider columns (fewer per row)
  <Grid min="350px">
    <article>Card A</article>
    <article>Card B</article>
    <article>Card C</article>
  </Grid>

  @example Typical use — card grid
  <Grid min="280px" space="var(--space-6, 1.5rem)" tag="ul">
    <li>Card one</li>
    <li>Card two</li>
    <li>Card three</li>
  </Grid>

  @example All props
  <Grid min="200px" space="2rem" tag="ol">
    <li>Item 1</li>
    <li>Item 2</li>
  </Grid>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type GridTag = 'div' | 'section' | 'article' | 'ul' | 'ol' | 'main';

  interface Props {
    min?: string;
    space?: string;
    tag?: GridTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let {
    min = '250px',
    space = 'var(--space-4, 1rem)',
    tag = 'div',
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived(
    [`--grid-min: ${min}`, `--grid-space: ${space}`, style].filter(Boolean).join('; '),
  );
</script>

<svelte:element this={tag} data-layout="grid" style={mergedStyle} {...rest}>
  {@render children()}
</svelte:element>

<style>
  :global([data-layout='grid']) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(var(--grid-min, 250px), 100%), 1fr));
    gap: var(--grid-space, 1rem);
  }
</style>
