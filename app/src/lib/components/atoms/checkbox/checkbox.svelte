<!--
  @component Checkbox

  Single checkbox. Supports checked, unchecked, and indeterminate states.

  Disabled state is handled via `aria-disabled` rather than the native `disabled`
  attribute, keeping the element keyboard-navigable and visible to assistive technology.
  Click and keydown events are suppressed internally when disabled.

  @prop checked          - Whether the checkbox is checked. Default: `false`
  @prop indeterminate    - Puts the checkbox in the indeterminate (mixed) state.
                           Takes visual precedence over `checked`. Default: `false`
  @prop disabled         - Marks the checkbox as disabled. Suppresses click/keydown events and
                           applies a muted style, but preserves tab focus and screen reader
                           visibility. Default: `false`
  @prop aria-label       - Accessible name when no visible label is present.
  @prop aria-labelledby  - ID(s) of element(s) that label this checkbox.
  @prop aria-describedby - ID of an element providing a longer description (hint, error message).
  @prop onclick          - Called on click when not disabled. Receives a standard `MouseEvent`.
  @prop onkeydown        - Called on keydown when not disabled. Receives a standard `KeyboardEvent`.

  All other `HTMLInputAttributes` are forwarded to the underlying `<input>`.

  @example Minimal
  <Checkbox />

  @example Controlled
  <Checkbox checked={agreed} onclick={() => agreed = !agreed} />

  @example Indeterminate (select-all)
  <Checkbox indeterminate={someChecked} checked={allChecked} onclick={toggleAll} />

  @example Disabled
  <Checkbox disabled checked />
-->
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    checked?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
  }

  let { checked, disabled, onclick, onkeydown, indeterminate, ...rest }: Props = $props();

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

  let el = $state<HTMLInputElement>();

  $effect(() => {
    if (el) el.indeterminate = indeterminate ?? false;
  });
</script>

<input
  bind:this={el}
  data-component="checkbox"
  type="checkbox"
  {checked}
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
