<!--
  @component Switcher

  Lays children side-by-side above a total container width (`threshold`) and
  stacks them vertically below it — no media queries needed.

  **threshold is total container width, not per-item width.**
  If you have 3 items and set `threshold="30rem"`, the items switch to side-by-side
  once the container is wider than 30rem total — not when each item is 30rem wide.

  **How it works:**
  Each child gets `flex-basis: calc((threshold - 100%) * 999)`.
  When the container is wider than threshold this resolves to a negative value,
  causing items to line up. When narrower, it resolves to a large positive value,
  forcing each item to full width.

  @prop threshold - Total container width at which items switch to side-by-side. Default: `"30rem"`
  @prop space     - Gap between items. Default: `var(--space-4, 1rem)`
  @prop tag       - Rendered HTML element. Default: `"div"`

  @example Minimal
  <Switcher>
    <div>Item one</div>
    <div>Item two</div>
  </Switcher>

  @example threshold — wider switch point for 3+ items
  <Switcher threshold="50rem">
    <div>One</div>
    <div>Two</div>
    <div>Three</div>
  </Switcher>

  @example Typical use — two-column feature section
  <Switcher threshold="40rem" tag="section">
    <article>Feature A</article>
    <article>Feature B</article>
  </Switcher>

  @example All props
  <Switcher threshold="40rem" space="2rem" tag="ul">
    <li>Item one</li>
    <li>Item two</li>
  </Switcher>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type SwitcherTag = 'div' | 'section' | 'article' | 'ul' | 'ol';

  interface Props {
    threshold?: string;
    space?: string;
    tag?: SwitcherTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let {
    threshold = '30rem',
    space = 'var(--space-4, 1rem)',
    tag = 'div',
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived(
    [`--switcher-threshold: ${threshold}`, `--switcher-space: ${space}`, style]
      .filter(Boolean)
      .join('; '),
  );
</script>

<svelte:element this={tag} data-layout="switcher" style={mergedStyle} {...rest}>
  {@render children()}
</svelte:element>

<style>
  :global([data-layout='switcher']) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--switcher-space, 1rem);
  }

  /* flex-basis trick — must target direct children to implement the switching algorithm */
  :global([data-layout='switcher'] > *) {
    flex-grow: 1;
    flex-basis: calc((var(--switcher-threshold, 30rem) - 100%) * 999);
  }
</style>
