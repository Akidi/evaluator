<!--
  @component Dot

  Tiny decorative bullet rendered as `<span aria-hidden="true">`.
  Use for visual list markers or inline separators — not for status
  (use StatusDot instead). All extra attributes are forwarded to the underlying element.

  @prop color - Semantic color token for the dot background.
                One of `'primary' | 'secondary' | 'accent' | 'neutral' | 'danger' | 'warning' | 'success' | 'info'`.
                Falls back to `currentColor` when omitted. Default: `undefined`

  @example Default color
  <Dot />

  @example Semantic color
  <Dot color="success" />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    color?:
      | 'primary'
      | 'secondary'
      | 'accent'
      | 'neutral'
      | 'danger'
      | 'warning'
      | 'success'
      | 'info';
  }

  let { color, ...rest }: Props = $props();
</script>

<span
  data-component="dot"
  aria-hidden="true"
  role="presentation"
  style:--dot-bg-color={color}
  {...rest}
></span>

<style>
  [data-component='dot'] {
    --dog-bg-color: currentColor;
    display: inline-block;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background: var(--dog-bg-color);
    flex-shrink: 0;
  }
</style>
