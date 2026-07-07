<!--
  @component QuantityStepper

  Increment/decrement control for numeric quantities with an editable input.
  Clamps values to `min`/`max` bounds. Used for serving size and ingredient scaling.

  @prop value    - Current numeric value. Default: `1`
  @prop min      - Minimum allowed value. No lower bound if omitted.
  @prop max      - Maximum allowed value. No upper bound if omitted.
  @prop step     - Amount to increment or decrement. Default: `1`
  @prop disabled - Disables all controls when true. Default: `false`
  @prop onchange - Called with the new value after any change.

  @example Basic
  <QuantityStepper value={2} onchange={(v) => (servings = v)} />

  @example With bounds
  <QuantityStepper value={1} min={1} max={12} onchange={(v) => (qty = v)} />
-->
<script lang="ts">
  import { Input, Button } from '$lib/components/atoms';
  import { Cluster } from '$lib/components/layouts';

  interface Props {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onchange?: (value: number) => void;
  }

  let { value = 1, min, max, step = 1, disabled = false, onchange, ...rest }: Props = $props();

  // svelte-ignore state_referenced_locally
  let current = $state(value);
  let atMin = $derived(min !== undefined && current <= min);
  let atMax = $derived(max !== undefined && current >= max);

  function decrement() {
    if (disabled || atMin) return;
    current = current - step;
    onchange?.(current);
  }

  function increment() {
    if (disabled || atMax) return;
    current = current + step;
    onchange?.(current);
  }

  function handleInput(e: Event) {
    const raw = (e.currentTarget as HTMLInputElement).valueAsNumber;
    if (isNaN(raw)) return;
    const clamped =
      min !== undefined
        ? max !== undefined
          ? Math.min(max, Math.max(min, raw))
          : Math.max(min, raw)
        : max !== undefined
          ? Math.min(max, raw)
          : raw;
    current = clamped;
    onchange?.(current);
  }
</script>

<Cluster data-component="quantity-stepper" align="center" {...rest}>
  <Button
    variant="ghost"
    disabled={disabled || atMin}
    onclick={decrement}
    aria-label="Decrease quantity"
    data-quantity-stepper-decrement>−</Button
  >
  <Input
    inputType="number"
    bind:value={current}
    oninput={handleInput}
    min={min !== undefined ? String(min) : undefined}
    max={max !== undefined ? String(max) : undefined}
    step={String(step)}
    {disabled}
    aria-label="Quantity"
    showIcon={false}
  />
  <Button
    variant="ghost"
    disabled={disabled || atMax}
    onclick={increment}
    aria-label="Increase quantity"
    data-quantity-stepper-increment>+</Button
  >
</Cluster>

<style>
  :global([data-component='quantity-stepper'] .input-wrapper) {
    width: 4rem;
  }

  :global([data-component='quantity-stepper'] [data-quantity-stepper-decrement]) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :global([data-component='quantity-stepper'] [data-quantity-stepper-increment]) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }
</style>
