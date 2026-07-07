<!--
  @component Radio

  Single radio button. Pair with sibling Radio components sharing the same `name`
  to form a mutually exclusive group.

  Disabled state is handled via `aria-disabled` rather than the native `disabled`
  attribute, keeping the element keyboard-navigable and visible to assistive technology.
  Click and keydown events are suppressed internally when disabled.

  @prop checked          - Whether this option is selected. Default: `false`
  @prop disabled         - Marks the radio as disabled. Suppresses click/keydown events and
                           applies a muted style, but preserves tab focus and screen reader
                           visibility. Default: `false`
  @prop aria-label       - Accessible name when no visible label is present.
  @prop aria-labelledby  - ID(s) of element(s) that label this radio.
  @prop aria-describedby - ID of an element providing a longer description (hint, error message).
  @prop onclick          - Called on click when not disabled. Receives a standard `MouseEvent`.
  @prop onkeydown        - Called on keydown when not disabled. Receives a standard `KeyboardEvent`.

  All other `HTMLInputAttributes` are forwarded to the underlying `<input>`.

  @example Group
  <Radio name="size" value="s" checked={size === 's'} onclick={() => size = 's'} />
  <Radio name="size" value="m" checked={size === 'm'} onclick={() => size = 'm'} />

  @example Disabled option
  <Radio name="size" value="xl" disabled />
-->
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    checked?: boolean;
    disabled?: boolean;
  }

  let { checked, value = $bindable(), disabled, onclick, onkeydown, ...rest }: Props = $props();

  const handleOnClick = (event: MouseEvent & { currentTarget: EventTarget & HTMLInputElement }) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onclick?.(event);
  };

  const handleKeydown = (
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
  type="radio"
  {checked}
  {value}
  onclick={handleOnClick}
  onkeydown={handleKeydown}
  aria-disabled={disabled ? 'true' : undefined}
  {...rest}
/>

<style>
  [aria-disabled='true'] {
    pointer-events: auto;
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
