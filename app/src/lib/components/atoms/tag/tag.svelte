<!--
  @component Tag

  Inline label chip, optionally dismissible. Use for ingredients, dietary
  filters, or any removable category label.

  @prop onremove - When provided, renders a dismiss button inside the tag.
  @prop children - Tag label content.

  @example Static
  <Tag>Vegetarian</Tag>

  @example Dismissible
  <Tag onremove={() => removeTag('vegetarian')}>Vegetarian</Tag>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
    onremove?: () => void;
    children: Snippet;
  }

  let { variant, onremove, children, ...rest }: Props = $props();
</script>

<span
  data-component="tag"
  data-variant={variant}
  data-removable={onremove ? true : undefined}
  {...rest}
>
  {@render children()}
  {#if onremove}
    <button type="button" aria-label="Remove" onclick={onremove}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  {/if}
</span>

<style>
  [data-component='tag'] {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: var(--tag-padding, 0.125rem 0.5rem);
    border-radius: var(--tag-radius, 9999px);
    font-size: var(--tag-font-size, 0.75rem);
    font-weight: 500;
    line-height: 1.5;
    background: var(--tag-bg, var(--surface-raised));
    color: var(--tag-color, var(--text));
    border: 1px solid var(--tag-border-color, transparent);
  }

  [data-component='tag'] button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    border-radius: 9999px;
    line-height: 1;
  }

  [data-component='tag'] button:hover {
    opacity: 1;
  }

  [data-component='tag'][data-variant='primary'] {
    background: var(--tag-primary-bg, var(--primary-subtle-bg));
    color: var(--tag-primary-color, var(--primary-text));
    border-color: var(--tag-primary-border, var(--primary-border));
  }

  [data-component='tag'][data-variant='success'] {
    background: var(--tag-success-bg, var(--success-subtle-bg));
    color: var(--tag-success-color, var(--success-text));
    border-color: var(--tag-success-border, var(--success-border));
  }

  [data-component='tag'][data-variant='warning'] {
    background: var(--tag-warning-bg, var(--warning-subtle-bg));
    color: var(--tag-warning-color, var(--warning-text));
    border-color: var(--tag-warning-border, var(--warning-border));
  }

  [data-component='tag'][data-variant='error'] {
    background: var(--tag-error-bg, var(--error-subtle-bg));
    color: var(--tag-error-color, var(--error-text));
    border-color: var(--tag-error-border, var(--error-border));
  }

  [data-component='tag'][data-variant='info'] {
    background: var(--tag-info-bg, var(--info-subtle-bg));
    color: var(--tag-info-color, var(--info-text));
    border-color: var(--tag-info-border, var(--info-border));
  }
</style>
