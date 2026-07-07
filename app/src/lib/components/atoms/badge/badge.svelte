<!--
  @component Badge

  Inline label for status, category, or metadata. Renders as a `<span>`.

  @prop variant - Visual style. One of `default` | `success` | `warning` | `danger` | `info`. Default: `"default"`

  @example Default
  <Badge>New</Badge>

  @example Variant
  <Badge variant="success">Vegetarian</Badge>

  @example All variants
  <Badge variant="default">Default</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="danger">Danger</Badge>
  <Badge variant="info">Info</Badge>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
    children: Snippet;
  }

  let { variant = 'default', children, ...rest }: Props = $props();
</script>

<span data-component="badge" data-variant={variant} {...rest}>{@render children()}</span>

<style>
  [data-component='badge'] {
    display: inline-flex;
    align-items: center;
    padding: var(--badge-padding, 0.125rem 0.5rem);
    border-radius: var(--badge-radius, 9999px);
    font-size: var(--badge-font-size, 0.75rem);
    font-weight: 500;
    line-height: 1.5;
    background: var(--badge-bg, var(--surface-raised));
    color: var(--badge-color, var(--text));
  }

  [data-component='badge'][data-variant='primary'] {
    background: var(--badge-primary-bg, var(--primary-subtle-bg));
    color: var(--badge-primary-color, var(--primary-text));
  }

  [data-component='badge'][data-variant='success'] {
    background: var(--badge-success-bg, var(--success-subtle-bg));
    color: var(--badge-success-color, var(--success-text));
  }

  [data-component='badge'][data-variant='warning'] {
    background: var(--badge-warning-bg, var(--warning-subtle-bg));
    color: var(--badge-warning-color, var(--warning-text));
  }

  [data-component='badge'][data-variant='danger'] {
    background: var(--badge-danger-bg, var(--error-subtle-bg));
    color: var(--badge-danger-color, var(--error-text));
  }

  [data-component='badge'][data-variant='info'] {
    background: var(--badge-info-bg, var(--info-subtle-bg));
    color: var(--badge-info-color, var(--info-text));
  }
</style>
