<!--
  @component Blockquote

  Styled quotation block. Renders a native `<blockquote>` with a decorative
  inline-start border. All extra attributes are forwarded to the underlying element.

  @prop children - Quoted content. Required.

  @example Basic
  <Blockquote>Bake with love.</Blockquote>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLBlockquoteAttributes } from 'svelte/elements';

  interface Props extends HTMLBlockquoteAttributes {
    children: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<blockquote data-component="blockquote" {...rest}>{@render children()}</blockquote>

<style>
  [data-component='blockquote'] {
    border-inline-start: 3px solid var(--border);
    padding-inline-start: var(--space-4);
    margin-inline: 0;
    color: var(--text-muted);
    font-style: italic;
  }
</style>
