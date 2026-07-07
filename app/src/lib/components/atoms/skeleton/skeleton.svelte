<!--
  @component Skeleton

  Animated shimmer placeholder shown while content is loading.
  Size controlled via `width`/`height` props or CSS custom properties.

  @prop variant - Shape. One of `"rect"` | `"circle"` | `"text"`. Default: `"rect"`
  @prop width   - CSS width value. Default: `"100%"`
  @prop height  - CSS height value. Default: `"1rem"`

  @example Text line
  <Skeleton variant="text" />

  @example Avatar placeholder
  <Skeleton variant="circle" width="2.5rem" height="2.5rem" />

  @example Card block
  <Skeleton width="100%" height="8rem" />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'rect' | 'circle' | 'text';
    width?: string;
    height?: string;
  }

  let { variant = 'rect', width = '100%', height = '1rem', style = '', ...rest }: Props = $props();

  let mergedStyle = $derived(
    [`--skeleton-width: ${width}`, `--skeleton-height: ${height}`, style ?? '']
      .filter(Boolean)
      .join('; '),
  );
</script>

<span
  data-component="skeleton"
  data-variant={variant}
  aria-hidden="true"
  style={mergedStyle}
  {...rest}
></span>

<style>
  [data-component='skeleton'] {
    display: block;
    width: var(--skeleton-width, 100%);
    height: var(--skeleton-height, 1rem);
    background: var(--skeleton-bg, var(--border));
    border-radius: var(--skeleton-radius, var(--radius-s, 0.25rem));
    overflow: hidden;
    position: relative;
  }

  [data-component='skeleton'][data-variant='circle'] {
    border-radius: 9999px;
  }

  [data-component='skeleton'][data-variant='text'] {
    border-radius: 9999px;
    height: 0.875em;
  }

  [data-component='skeleton']::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--skeleton-shimmer-color, color-mix(in oklch, var(--surface) 60%, transparent)) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
    transform: translateX(-100%);
  }

  @keyframes shimmer {
    to {
      transform: translateX(100%);
    }
  }
</style>
