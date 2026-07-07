<!--
  @component ColorSwatch

  Small colour chip used in ingredient or product listings. Renders as a
  `<span role="img">` — accessible but purely decorative. All extra attributes
  are forwarded to the underlying element.

  @prop color     - Any valid CSS color value applied via `--swatch-color`. Required.
  @prop ariaLabel - Accessible name describing the color (e.g. `"Crimson red"`). Required.

  @example Basic
  <ColorSwatch color="#e63946" ariaLabel="Crimson red" />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    color: string;
    ariaLabel: string;
  }

  let { color, ariaLabel, ...rest }: Props = $props();
</script>

<span
  data-component="color-swatch"
  role="img"
  aria-label={ariaLabel}
  style="--swatch-color: {color}"
  {...rest}
></span>

<style>
  [data-component='color-swatch'] {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: var(--radius-sm, 0.25rem);
    background: var(--swatch-color);
    outline: 1px solid oklch(0 0 0 / 0.15);
    flex-shrink: 0;
  }
</style>
