<!--
  @component Kbd

  Keyboard key label. Renders a native `<kbd>` element styled as a key cap.
  All extra attributes are forwarded to the underlying element.

  @prop children - Key name or symbol. Required.

  @example Single key
  <Kbd>⌘</Kbd>

  @example Key combination
  <Kbd>Ctrl</Kbd>+<Kbd>S</Kbd>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    children: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<kbd data-component="kbd" {...rest}>{@render children()}</kbd>

<style>
  [data-component='kbd'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    padding: var(--kbd-padding, var(--space-0\.5) var(--space-1\.5));
    font-family: var(--font-mono);
    font-size: var(--kbd-font-size, var(--text-xs));
    line-height: 1;
    color: var(--kbd-color, var(--text-muted));
    background: var(--kbd-bg, var(--surface-sunken));
    border: 1px solid var(--kbd-border-color, var(--border));
    border-radius: var(--radius-sm);
    box-shadow: var(--kbd-shadow, 0 1px 0 var(--border-emphasis));
  }
</style>
