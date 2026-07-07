<!--
  @component Box

  Applies padding and an optional border around any content.
  Has zero visual styling by design — background colour, border colour,
  and border radius must be applied via `style` or a parent class.

  **Color inheritance:** All descendant text inherits `color` from the Box,
  ensuring foreground and background always travel together.

  @prop padding     - Inner padding. Default: `var(--space-4, 1rem)`
  @prop borderWidth - Border width (uses `border-style: solid`). Default: `"0"` (no border)
  @prop tag         - Rendered HTML element. Default: `"div"`

  @example Minimal
  <Box>
    <p>Content</p>
  </Box>

  @example borderWidth — outlined card
  <Box borderWidth="1px" style="border-color: var(--border);">
    <p>Outlined content</p>
  </Box>

  @example Typical use — content card
  <Box padding="var(--space-6, 1.5rem)" tag="article" style="background: var(--surface-raised);">
    <h2>Card title</h2>
    <p>Card body</p>
  </Box>

  @example All props
  <Box padding="2rem" borderWidth="2px" tag="section" style="border-color: var(--primary-border);">
    <p>Content</p>
  </Box>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type BoxTag =
    | 'div'
    | 'section'
    | 'article'
    | 'ul'
    | 'ol'
    | 'li'
    | 'main'
    | 'nav'
    | 'aside'
    | 'header'
    | 'footer';

  interface Props {
    padding?: string;
    borderWidth?: string;
    tag?: BoxTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let {
    padding = 'var(--space-4, 1rem)',
    borderWidth = '0',
    tag = 'div',
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived(
    [`--box-padding: ${padding}`, `--box-border-width: ${borderWidth}`, style]
      .filter(Boolean)
      .join('; '),
  );
</script>

<svelte:element this={tag} data-layout="box" style={mergedStyle} {...rest}>
  {@render children()}
</svelte:element>

<style>
  :global([data-layout='box']) {
    padding: var(--box-padding, 1rem);
    border-width: var(--box-border-width, 0);
    border-style: solid;
  }

  :global([data-layout='box'] *) {
    color: inherit;
  }
</style>
