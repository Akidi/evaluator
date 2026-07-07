<!--
  @component FormField

  Self-contained labeled form control. FormField *owns* the input element it
  renders (an `Input`, `Textarea`, or `Select` chosen via `as`), so it can wire
  up accessibility correctly: the `<label for>` targets the real control, and
  the control carries `aria-describedby` (pointing at the hint/error) and
  `aria-invalid` automatically.

  Extra attributes (`name`, `placeholder`, `required`, `min`, `rows`,
  `autocomplete`, …) are forwarded to the underlying control. Use `bind:value`
  for controlled fields; omit it for uncontrolled native form submission.

  @prop label    - Label text (required).
  @prop as       - Which control to render. One of `'input' | 'textarea' | 'select'`. Default: `'input'`
  @prop type     - Native input type, used when `as="input"`. Default: `'text'`
  @prop hint     - Helper text shown below the control. Linked via aria-describedby.
  @prop error    - Validation error message. Linked via aria-describedby and sets aria-invalid.
  @prop required - Marks the field as required.
  @prop value    - Field value. Bindable.
  @prop children - `<option>` elements, used when `as="select"`.

  @example Text input
  <FormField label="Email" type="email" name="email" required hint="We never share it" />

  @example Textarea (controlled)
  <FormField label="Notes" as="textarea" name="notes" rows="3" bind:value={notes} />

  @example Select
  <FormField label="Unit" as="select" name="unit" bind:value={unit}>
    <option value="g">g</option>
    <option value="ml">ml</option>
  </FormField>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Input, Textarea, Select } from '$lib/components/atoms';

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
    | 'week';

  interface Props {
    label: string;
    as?: 'input' | 'textarea' | 'select';
    type?: InputType;
    hint?: string;
    error?: string;
    required?: boolean;
    value?: string | number;
    oninput?: (event: Event & { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => void;
    onchange?: (
      event: Event & { currentTarget: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement },
    ) => void;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    label,
    as = 'input',
    type = 'text',
    hint,
    error,
    required = false,
    value = $bindable(),
    oninput,
    onchange,
    children,
    ...rest
  }: Props = $props();

  const fieldId = `field-${Math.random().toString(36).slice(2, 8)}`;
  const hintId = $derived(hint ? `${fieldId}-hint` : undefined);
  const errorId = $derived(error ? `${fieldId}-error` : undefined);
  const describedby = $derived([hintId, errorId].filter(Boolean).join(' ') || undefined);
  const invalid = $derived(error ? true : undefined);
</script>

<div data-component="form-field" data-invalid={error ? true : undefined}>
  <label for={fieldId} data-form-field-label>
    {label}
    {#if required}<span aria-hidden="true">*</span>{/if}
  </label>

  {#if as === 'textarea'}
    <Textarea
      id={fieldId}
      {required}
      value={value as string}
      aria-describedby={describedby}
      aria-invalid={invalid}
      oninput={(e) => {
        value = e.currentTarget.value;
        oninput?.(e);
      }}
      {onchange}
      {...rest}
    />
  {:else if as === 'select'}
    <Select
      id={fieldId}
      {required}
      {value}
      aria-describedby={describedby}
      aria-invalid={invalid}
      onchange={(e) => {
        value = e.currentTarget.value;
        onchange?.(e);
      }}
      {...rest}
    >
      {@render children?.()}
    </Select>
  {:else}
    <Input
      id={fieldId}
      inputType={type}
      showIcon={false}
      {required}
      bind:value
      aria-describedby={describedby}
      aria-invalid={invalid}
      {oninput}
      {onchange}
      {...rest}
    />
  {/if}

  {#if hint && !error}
    <span id={hintId} data-form-field-hint>{hint}</span>
  {/if}
  {#if error}
    <span id={errorId} data-form-field-error role="alert">{error}</span>
  {/if}
</div>

<style>
  [data-component='form-field'] {
    display: flex;
    flex-direction: column;
    gap: var(--field-gap, 0.25rem);
  }

  [data-form-field-label] {
    font-size: var(--field-label-font-size, 0.875rem);
    font-weight: 500;
    color: var(--field-label-color, var(--text));
  }

  [data-form-field-label] span {
    color: var(--field-required-color, var(--error-text));
    margin-inline-start: 0.25rem;
  }

  [data-form-field-hint] {
    font-size: var(--field-hint-font-size, 0.75rem);
    color: var(--field-hint-color, var(--text-muted));
  }

  [data-form-field-error] {
    font-size: var(--field-error-font-size, 0.75rem);
    color: var(--field-error-color, var(--error-text));
  }
</style>
