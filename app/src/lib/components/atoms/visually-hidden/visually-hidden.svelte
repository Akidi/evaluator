<!--
  @component VisuallyHidden

  Renders content that is invisible on screen but remains accessible to screen
  readers. Use for supplemental context on icon-only buttons, decorative
  elements, or any case where visible text would be redundant.

  @prop children  - Content to hide visually. Required.

  @example Icon button with accessible label
  <Button aria-label={undefined}>
    <Icon name="close" />
    <VisuallyHidden>Close menu</VisuallyHidden>
  </Button>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    children: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<span data-component="visually-hidden" {...rest}>{@render children()}</span>

<style>
  span {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
