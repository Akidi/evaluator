<!--
  @component Slider

  Range input element. All extra attributes are forwarded to the underlying <input type="range">.

  Disabled state uses `aria-disabled` rather than the native `disabled` attribute, keeping the
  element focusable and reachable by assistive technology.

  @prop disabled  - Suppresses input/change events and sets `aria-disabled="true"`. Default: `false`
  @prop oninput   - Called on input when not disabled.
  @prop onchange  - Called on change when not disabled.

  @example Basic
  <Slider min={0} max={100} value={50} oninput={handleInput} />

  @example Disabled
  <Slider disabled value={30} />
-->
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    disabled?: boolean;
  }

  let { disabled, oninput, onchange, ...rest }: Props = $props();

  const handleInput = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    oninput?.(event);
  };

  const handleChange = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onchange?.(event);
  };
</script>

<input
  type="range"
  oninput={handleInput}
  onchange={handleChange}
  aria-disabled={disabled ? 'true' : undefined}
  {...rest}
  class="slider"
/>

<style>
  .slider {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    width: 100%;
    height: 1.25rem;
    background: transparent;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }

  /* Track */
  .slider::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: var(--radius-full);
    background: var(--border-emphasis, var(--border));
    transition: background var(--duration-fast) var(--ease-default);
  }

  .slider::-moz-range-track {
    height: 4px;
    border-radius: var(--radius-full);
    background: var(--border-emphasis, var(--border));
    transition: background var(--duration-fast) var(--ease-default);
  }

  /* Thumb */
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: var(--radius-full);
    background: var(--primary);
    border: 2px solid var(--primary);
    margin-top: -6px;
    box-shadow: var(--shadow-sm);
    transition:
      transform var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default);
  }

  .slider::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    border-radius: var(--radius-full);
    background: var(--primary);
    border: 2px solid var(--primary);
    box-shadow: var(--shadow-sm);
    transition:
      transform var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default);
  }

  /* Hover */
  .slider:hover::-webkit-slider-thumb {
    transform: scale(1.15);
  }

  .slider:hover::-moz-range-thumb {
    transform: scale(1.15);
  }

  /* Focus */
  .slider:focus-visible {
    outline: none;
  }

  .slider:focus-visible::-webkit-slider-thumb {
    box-shadow: 0 0 0 var(--focus-ring-width) var(--focus-ring);
  }

  .slider:focus-visible::-moz-range-thumb {
    box-shadow: 0 0 0 var(--focus-ring-width) var(--focus-ring);
  }

  /* Disabled */
  .slider[aria-disabled='true'],
  .slider:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
