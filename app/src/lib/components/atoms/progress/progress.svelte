<!--
  @component Progress

  Accessible progress bar. Renders a native `<progress>` element with
  ARIA attributes and a labelled track/fill for custom styling.

  @prop value - Current value (0 to `max`). Omit for indeterminate state.
  @prop max   - Maximum value. Default: `100`
  @prop label - Accessible label. Default: `"Progress"`

  @example Determinate
  <Progress value={60} />

  @example Indeterminate
  <Progress />

  @example Custom max and label
  <Progress value={3} max={5} label="Step 3 of 5" />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    label?: string;
  }

  let { value = $bindable(), max = 100, label = 'Progress', ...rest }: Props = $props();

  let percent = $derived(value != null ? Math.min(100, Math.max(0, (value / max) * 100)) : null);
  let indeterminate = $derived(value == null);
</script>

<div
  data-component="progress"
  data-indeterminate={indeterminate ? true : undefined}
  role="progressbar"
  aria-label={label}
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={max}
  {...rest}
>
  <span data-progress-fill style={percent != null ? `width: ${percent}%` : undefined}></span>
</div>

<style>
  [data-component='progress'] {
    width: 100%;
    height: var(--progress-height, 0.5rem);
    background: var(--progress-track-bg, var(--border));
    border-radius: var(--progress-radius, 9999px);
    overflow: hidden;
  }

  [data-progress-fill] {
    display: block;
    height: 100%;
    background: var(--progress-fill-bg, var(--primary));
    border-radius: inherit;
    transition: width 0.2s ease;
  }

  [data-component='progress'][data-indeterminate] [data-progress-fill] {
    width: 40%;
    animation: indeterminate 1.4s infinite ease-in-out;
  }

  @keyframes indeterminate {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(350%);
    }
  }
</style>
