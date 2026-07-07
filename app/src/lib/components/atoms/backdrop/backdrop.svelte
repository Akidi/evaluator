<!--
  @component Backdrop

  Full-screen overlay used behind modals and drawers. Opacity-transitions in
  when `visible` is true. Optionally dismissible via click.

  @prop visible      - Whether the backdrop is shown. Required.
  @prop dismissible  - When `true`, a click fires `onDismiss`. Default: `false`
  @prop onDismiss    - Called when the backdrop is clicked and `dismissible` is `true`.
                       Default: `undefined`

  @example Basic
  <Backdrop visible={isOpen} />

  @example Dismissible
  <Backdrop visible={isOpen} dismissible onDismiss={() => (isOpen = false)} />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    visible: boolean;
    dismissible?: boolean;
    onDismiss?: () => void;
  }

  let { visible, dismissible = false, onDismiss, ...rest }: Props = $props();

  function handleClick() {
    if (dismissible) onDismiss?.();
  }
</script>

<div
  data-component="backdrop"
  data-visible={String(visible)}
  role="presentation"
  onclick={handleClick}
  {...rest}
></div>

<style>
  [data-component='backdrop'] {
    position: fixed;
    inset: 0;
    background: oklch(0 0 0 / 0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 50;
  }

  [data-component='backdrop'][data-visible='true'] {
    opacity: 1;
    pointer-events: auto;
  }

  [data-component='backdrop'][data-dismissible='true'] {
    cursor: pointer;
  }
</style>
