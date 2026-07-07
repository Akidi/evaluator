<!--
  @component Toggle

  Switch-style toggle rendered as `<input type="checkbox" role="switch">`. All extra attributes
  are forwarded to the underlying input.

  Disabled state uses `aria-disabled` rather than the native `disabled` attribute, keeping the
  element focusable and reachable by assistive technology.

  @prop checked   - Whether the toggle is on. Default: `false`
  @prop disabled  - Suppresses click/keydown events and sets `aria-disabled="true"`. Default: `false`
  @prop onclick   - Called on click when not disabled.
  @prop onkeydown - Called on keydown when not disabled.

  @example Basic
  <Toggle checked={isEnabled} onclick={() => isEnabled = !isEnabled} />

  @example Disabled
  <Toggle disabled checked={true} />
-->
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    checked?: boolean;
    disabled?: boolean;
  }

  let { checked, disabled, onclick, onkeydown, ...rest }: Props = $props();

  const handleOnClick = (event: MouseEvent & { currentTarget: EventTarget & HTMLInputElement }) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onclick?.(event);
  };

  const handleOnKeydown = (
    event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement },
  ) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onkeydown?.(event);
  };
</script>

<input
  {checked}
  data-component="toggle"
  onclick={handleOnClick}
  onkeydown={handleOnKeydown}
  aria-disabled={disabled ? 'true' : undefined}
  type="checkbox"
  role="switch"
  {...rest}
/>

<style>
  [data-component='toggle'] {
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    display: inline-block;
    flex-shrink: 0;
    width: 2.25rem;
    height: 1.25rem;
    border-radius: var(--radius-full);
    background: var(--border-emphasis, var(--border));
    border: none;
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-default);
  }
  [data-component='toggle']::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 1rem;
    height: 1rem;
    border-radius: var(--radius-full);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    transition: transform var(--duration-fast) var(--ease-default);
  }
  [data-component='toggle']:checked {
    background: var(--primary);
  }
  [data-component='toggle']:checked::before {
    transform: translateX(1rem);
  }
  [data-component='toggle']:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring);
    outline-offset: var(--focus-ring-offset);
  }
  [data-component='toggle'][aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: auto;
  }
</style>
