<!--
  @component Input

  Text entry component with an optional leading `InputTypeIcon` and a
  native `<input>` inside a styled wrapper. All extra attributes (e.g.
  `placeholder`, `value`, `name`) are forwarded to the underlying `<input>`.

  When `inputType` is `"hidden"` the wrapper and icon are skipped and a bare
  `<input type="hidden">` is rendered instead.

  Disabled state is handled via `aria-disabled` rather than the native `disabled`
  attribute, keeping the element keyboard-navigable and visible to assistive technology.
  Input and change events are suppressed internally when disabled.

  @prop inputType  				- Native input type and icon selector.
														One of `'text' | 'email' | 'password' | 'number' | 'search' |
														'tel' | 'url' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'hidden'`.
														Default: `'text'`
  @prop disabled   				- Marks the input as disabled. Suppresses input/change events and
														applies a muted style, but preserves tab focus and screen reader
														visibility. Default: `false`
	@prop aria-label        - Accessible name when no visible label is present.
	@prop aria-labelledby   - ID(s) of element(s) that label this input.
	@prop aria-describedby  - ID of an element providing a longer description (hint, error message).
	@prop aria-required     - Marks the field as required for form submission.
	@prop aria-invalid      - Marks the field as invalid. Use with aria-describedby to point to the error.
	@prop showIcon	 				- Show the leading type icon. Default: true
  @prop oninput    				- Called on input when not disabled. Receives a standard `InputEvent`.
  @prop onchange   				- Called on change when not disabled. Receives a standard `Event`.

  All other `HTMLInputAttributes` are forwarded to the underlying `<input>`.

  @example Minimal
  <Input />

  @example Email field
  <Input inputType="email" placeholder="you@example.com" name="email" />

  @example Disabled
  <Input inputType="text" disabled placeholder="Read only" />

  @example Hidden field
  <Input inputType="hidden" name="csrf" value={token} />

  @example With event handlers
  <Input inputType="text" oninput={(e) => console.log(e.currentTarget.value)} />
-->
<script lang="ts">
  import InputTypeIcon from './InputTypeIcon.svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type InputType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'search'
    | 'tel'
    | 'url'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'hidden';

  type EventType = Event & { currentTarget: EventTarget & HTMLInputElement };

  interface Props extends HTMLInputAttributes {
    inputType?: InputType;
    disabled?: boolean;
    showIcon?: boolean;
  }

  let {
    value = $bindable(),
    inputType = 'text',
    disabled = false,
    showIcon = true,
    oninput,
    onchange,
    ...rest
  }: Props = $props();

  // Mirror the native control's value into the bindable `value` prop so
  // `bind:value` works. Number inputs coerce to a number; an empty number field
  // leaves the bound value untouched (writing `null`/`NaN` back through the
  // component binding breaks Svelte's input value reconciliation). Every other
  // type stays a string. Only runs for enabled inputs so disabled edits remain
  // suppressed.
  const syncValue = (el: HTMLInputElement) => {
    if (inputType === 'number') {
      if (el.value !== '') value = el.valueAsNumber;
    } else {
      value = el.value;
    }
  };

  const handleInput = (event: EventType) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    syncValue(event.currentTarget);
    oninput?.(event);
  };

  const handleChange = (event: EventType) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    syncValue(event.currentTarget);
    onchange?.(event);
  };
</script>

{#if inputType === 'hidden'}
  <input type="hidden" {...rest} />
{:else}
  <div class="input-wrapper" class:input-wrapper--disabled={disabled}>
    {#if showIcon}
      <InputTypeIcon type={inputType} size={16} />
    {/if}
    <input
      data-component="input"
      {value}
      type={inputType}
      oninput={handleInput}
      onchange={handleChange}
      aria-disabled={disabled ? 'true' : undefined}
      {...rest}
    />
  </div>
{/if}

<style>
  .input-wrapper {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    position: relative;
    padding-inline: var(--space-3);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    transition:
      border-color var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default);
  }

  .input-wrapper:focus-within {
    border-color: var(--primary-border-emphasis);
    box-shadow: 0 0 0 var(--focus-ring-width) var(--focus-ring);
  }

  .input-wrapper--disabled {
    background: var(--surface-sunken);
    opacity: 0.5;
    pointer-events: auto;
    cursor: not-allowed;
  }

  [data-component='input'] {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding-block: var(--space-2);
    font-size: var(--text-sm);
    font-family: inherit;
    line-height: 1.5;
    color: var(--text);
    min-width: 0;
  }

  [data-component='input']::placeholder {
    color: var(--text-faint);
  }
</style>
