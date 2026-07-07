<!--
  @component Spinner

  Animated loading indicator with `role="status"` and an accessible label.
  Hidden from sighted users via `aria-hidden` on the SVG.

  @prop label - Accessible label announced to screen readers. Default: `"Loading…"`
  @prop size  - SVG size. One of `sm` | `md` | `lg`. Default: `"md"`

  @example Default
  <Spinner />

  @example Custom label
  <Spinner label="Saving recipe…" />

  @example Sizes
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    label?: string;
    size?: 'sm' | 'md' | 'lg';
  }

  let { label = 'Loading…', size = 'md', ...rest }: Props = $props();
</script>

<span data-component="spinner" data-size={size} role="status" aria-label={label} {...rest}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    aria-hidden="true"
  >
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
</span>

<style>
  [data-component='spinner'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--spinner-color, currentColor);
  }

  [data-component='spinner'] svg {
    animation: spin 0.75s linear infinite;
  }

  [data-component='spinner'][data-size='sm'] svg {
    width: 1rem;
    height: 1rem;
  }

  [data-component='spinner'][data-size='md'] svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  [data-component='spinner'][data-size='lg'] svg {
    width: 2.5rem;
    height: 2.5rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
