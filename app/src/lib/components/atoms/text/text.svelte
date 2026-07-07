<!--
  @component Text

  Polymorphic inline/block text element. All extra attributes are forwarded to the underlying element.

  @prop as        - HTML element to render. One of `'p' | 'span' | 'small' | 'div'`. Default: `'p'`
  @prop size      - Font size. One of `'sm' | 'md' | 'lg'`. Default: `undefined`
  @prop color     - Text color token. One of `'default' | 'muted' | 'faint' | 'danger' | 'success' | 'warning' | 'info'`. Required.
  @prop weight    - Font weight. One of `'normal' | 'medium' | 'semibold' | 'bold'`. Default: `undefined`
  @prop truncate  - Truncates text to a single line with an ellipsis. Default: `false`
  @prop lines     - Clamps text to N lines using `-webkit-line-clamp`. Takes precedence over `truncate`. Default: `undefined`
  @prop children  - Text content. Required.

  @example Basic
  <Text color="default">Hello world</Text>

  @example Muted small label
  <Text as="span" size="sm" color="muted">Last updated 2 days ago</Text>

  @example Line clamp
  <Text color="default" lines={3}>Long description that will be clamped...</Text>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    as?: 'p' | 'span' | 'small' | 'div';
    size?: 'sm' | 'md' | 'lg';
    color?: 'default' | 'muted' | 'faint' | 'danger' | 'success' | 'warning' | 'info';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    truncate?: boolean;
    lines?: number;
    children: Snippet;
  }

  let {
    as = 'p',
    size = 'md',
    color = 'default',
    weight = 'normal',
    truncate = false,
    lines,
    children,
    ...rest
  }: Props = $props();
</script>

<svelte:element
  this={as}
  data-component="text"
  data-size={size}
  data-color={color}
  data-weight={weight}
  data-truncate={truncate || undefined}
  data-lines={lines}
  style={lines != null
    ? `display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:${lines};overflow:hidden;`
    : undefined}
  {...rest}
>
  {@render children()}
</svelte:element>

<style>
  [data-size='sm'] {
    font-size: var(--text-sm);
  }
  [data-size='md'] {
    font-size: var(--text-md);
  }
  [data-size='lg'] {
    font-size: var(--text-lg);
  }
  [data-color='muted'] {
    color: var(--text-muted);
  }
  [data-color='faint'] {
    color: var(--text-faint);
  }
  [data-color='danger'] {
    color: var(--danger-text);
  }
  [data-color='success'] {
    color: var(--success-text);
  }
  [data-color='warning'] {
    color: var(--warning-text);
  }
  [data-color='info'] {
    color: var(--info-text);
  }
  [data-weight='semibold'] {
    font-weight: var(--font-semibold);
  }
  [data-weight='bold'] {
    font-weight: var(--font-bold);
  }
  [data-truncate] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
