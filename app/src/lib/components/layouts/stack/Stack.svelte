<!--
  @component Stack

  Adds consistent vertical space between its direct children using the
  CSS owl selector (`* + *`). Margin only appears between elements —
  never before the first or after the last child.

  **Why not just margin on children?**
  Margin applied to individual elements is context-unaware — it leaks out
  at the edges and doubles up inside padded containers. Stack styles the
  relationship between siblings, not the elements themselves.

  @prop space - Space between each child. Default: `var(--space-4, 1rem)`
  @prop tag   - Rendered HTML element. Default: `"div"`

  @example Minimal
  <Stack>
    <p>First</p>
    <p>Second</p>
    <p>Third</p>
  </Stack>

  @example Custom spacing
  <Stack space="2rem">
    <section>Section A</section>
    <section>Section B</section>
  </Stack>

  @example Typical use — article body
  <Stack space="var(--space-6, 1.5rem)" tag="article">
    <h1>Title</h1>
    <p>Paragraph one</p>
    <p>Paragraph two</p>
  </Stack>

  @example All props
  <Stack space="1.5rem" tag="ul">
    <li>Item one</li>
    <li>Item two</li>
  </Stack>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type StackTag =
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
    space?: string;
    tag?: StackTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let {
    space = 'var(--space-4, 1rem)',
    tag = 'div',
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived([`--stack-space: ${space}`, style].filter(Boolean).join('; '));
</script>

<svelte:element this={tag} data-layout="stack" style={mergedStyle} {...rest}>
  {@render children()}
</svelte:element>

<style>
  :global([data-layout='stack']) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  :global([data-layout='stack'] > * + *) {
    margin-block-start: var(--stack-space, 1rem);
  }

  :global([data-layout='stack'] > :nth-child(2)) {
    margin-block-end: auto;
  }
</style>
