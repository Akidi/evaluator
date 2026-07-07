<!--
  @component RadioGroup

  Fieldset wrapping Radio + Label atom pairs in a Stack layout. Used for
  dietary filters, meal types, and any set of mutually exclusive choices.

  @prop name     - Shared `name` attribute for all radio inputs (required for mutual exclusion).
  @prop legend   - Visible group label rendered as a `<legend>`.
  @prop options  - Array of `{ label, value, disabled? }` objects.
  @prop value    - Currently selected value. Default: `undefined`
  @prop disabled - Disables all options when true. Default: `false`
  @prop required - Marks the group as required for form submission. Default: `false`
  @prop onchange - Called with the selected value when an option is clicked.

  @example Meal type selector
  <RadioGroup
    name="meal-type"
    legend="Meal type"
    options={[
      { label: 'Breakfast', value: 'breakfast' },
      { label: 'Lunch', value: 'lunch' },
      { label: 'Dinner', value: 'dinner' }
    ]}
    value="lunch"
    onchange={(v) => (selected = v)}
  />
-->
<script lang="ts">
  import { Radio, Label } from '$lib/components/atoms';
  import { Stack, Cluster } from '$lib/components/layouts';

  interface Option {
    label: string;
    value: string;
    disabled?: boolean;
  }

  interface Props {
    name: string;
    legend: string;
    options: Option[];
    value?: string;
    disabled?: boolean;
    required?: boolean;
    onchange?: (value: string) => void;
  }

  let {
    name,
    legend,
    options,
    value,
    disabled = false,
    required = false,
    onchange,
  }: Props = $props();

  const nextGroupId = (() => {
    let n = 0;
    return () => `radio-group-${n++}`;
  })();
  const groupId = nextGroupId();
</script>

<fieldset data-component="radio-group">
  <legend data-radio-group-legend>{legend}</legend>
  <Stack space="var(--space-2)">
    {#each options as option, i (i)}
      {@const optionId = `${groupId}-${option.value}`}
      <Cluster space="var(--space-2)" align="center">
        <Radio
          id={optionId}
          {name}
          {required}
          value={option.value}
          checked={value === option.value}
          disabled={disabled || option.disabled}
          onclick={() => onchange?.(option.value)}
        />
        <Label for={optionId}>{option.label}</Label>
      </Cluster>
    {/each}
  </Stack>
</fieldset>

<style>
  [data-component='radio-group'] {
    border: none;
    padding: 0;
    margin: 0;
  }

  [data-radio-group-legend] {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text);
    margin-block-end: var(--space-2);
  }
</style>
