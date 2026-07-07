<!--
  @component Meter

  Scalar gauge showing a known range (e.g. nutritional values, stock level).
  Renders a native `<meter>` element, optionally wrapped in a `<label>`.
  All extra attributes are forwarded to the underlying `<meter>`.

  @prop value - Current value within the meter range. Required.
  @prop label - Visible label text. When provided the meter is wrapped in a `<label>`.
                Default: `undefined`

  @example Basic
  <Meter value={0.6} min={0} max={1} />

  @example With label
  <Meter value={400} min={0} max={2000} label="Calories" />
-->
<script lang="ts">
  import type { HTMLMeterAttributes } from 'svelte/elements';

  interface Props extends HTMLMeterAttributes {
    value: number;
    label?: string;
  }

  let { value, label, ...rest }: Props = $props();
</script>

{#if label}<label class="meter-label"
    >{label}<meter data-component="meter" {value} {...rest}></meter></label
  >{:else}<meter data-component="meter" {value} {...rest}></meter>{/if}

<style>
  .meter-label {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    font-size: var(--meter-label-font-size, var(--text-sm));
    color: var(--meter-label-color, var(--text-muted));
    font-weight: var(--font-medium);
  }

  [data-component='meter'] {
    display: block;
    width: var(--meter-width, 100%);
    height: var(--meter-height, 0.5rem);
    border-radius: var(--meter-radius, var(--radius-full));
    overflow: hidden;
    border: none;
    appearance: none;
    -webkit-appearance: none;
  }

  [data-component='meter']::-webkit-meter-bar {
    background: var(--meter-track-bg, var(--border));
    border-radius: var(--radius-full);
    border: none;
  }

  [data-component='meter']::-webkit-meter-optimum-value {
    background: var(--meter-fill, var(--success));
    border-radius: var(--radius-full);
  }

  [data-component='meter']::-webkit-meter-suboptimum-value {
    background: var(--meter-suboptimum-fill, var(--warning));
    border-radius: var(--radius-full);
  }

  [data-component='meter']::-webkit-meter-even-less-good-value {
    background: var(--meter-critical-fill, var(--error));
    border-radius: var(--radius-full);
  }

  [data-component='meter']::-moz-meter-bar {
    background: var(--meter-fill, var(--success));
    border-radius: var(--radius-full);
  }
</style>
