<!--
  @component Code

  Inline code span. Renders a `<code>` element with monospace font and a
  subtle background. All extra attributes are forwarded to the underlying element.

  @prop children - Code content. Required.

  @example Inline snippet
  Use <Code>npm install</Code> to install dependencies.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    children: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<code data-component="code" {...rest}>{@render children()}</code>

<style>
  [data-component='code'] {
    font-family: var(--font-mono, monospace);
    font-size: 0.875em;
    background: var(--surface-raised, oklch(0 0 0 / 0.06));
    padding: 0.1em 0.35em;
    border-radius: var(--radius-sm, 0.25rem);
  }
</style>
