<!--
  @component Textarea

  Multi-line text input. All extra attributes are forwarded to the underlying <textarea>.

  Disabled state uses `aria-disabled` rather than the native `disabled` attribute, keeping the
  element focusable and reachable by assistive technology.

  @prop value     - Controlled text value. Default: `undefined`
  @prop disabled  - Suppresses input/change events and sets `aria-disabled="true"`. Default: `false`
  @prop oninput   - Called on input when not disabled.
  @prop onchange  - Called on change when not disabled.

  @example Basic
  <Textarea placeholder="Enter notes..." oninput={handleInput} />

  @example Bound value
  <Textarea bind:value={notes} />

  @example Disabled
  <Textarea disabled value="Read-only content" />
-->
<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  interface Props extends HTMLTextareaAttributes {
    value?: string;
    disabled?: boolean;
  }

  let { value = $bindable(), disabled, oninput, onchange, ...rest }: Props = $props();

  const handleInput = (event: Event & { currentTarget: EventTarget & HTMLTextAreaElement }) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    value = event.currentTarget.value;
    oninput?.(event);
  };

  const handleOnChange = (event: Event & { currentTarget: EventTarget & HTMLTextAreaElement }) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    value = event.currentTarget.value;
    onchange?.(event);
  };
</script>

<textarea
  data-component="textarea"
  {value}
  oninput={handleInput}
  onchange={handleOnChange}
  aria-disabled={disabled ? 'true' : undefined}
  {...rest}
></textarea>

<style>
  [data-component='textarea'] {
    display: block;
    width: 100%;
    min-height: var(--textarea-min-height, 6rem);
    padding: var(--textarea-padding, var(--space-2) var(--space-3));
    font-size: var(--textarea-font-size, var(--text-sm));
    font-family: inherit;
    line-height: var(--leading-relaxed);
    color: var(--text);
    background: var(--textarea-bg, var(--surface));
    border: 1px solid var(--textarea-border, var(--border));
    border-radius: var(--textarea-radius, var(--radius-md));
    resize: var(--textarea-resize, vertical);
    transition:
      border-color var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default);
    box-sizing: border-box;
  }

  [data-component='textarea']::placeholder {
    color: var(--text-faint);
  }

  [data-component='textarea']:focus-visible {
    outline: none;
    border-color: var(--primary-border-emphasis);
    box-shadow: 0 0 0 var(--focus-ring-width) var(--focus-ring);
  }

  [data-component='textarea'][aria-disabled='true'] {
    background: var(--surface-sunken);
    opacity: 0.5;
    cursor: not-allowed;
    resize: none;
  }
</style>
