<!--
  @component CheckboxGroup

  Fieldset wrapping Checkbox + Label atom pairs in a Stack layout.
  Used for dietary restrictions, ingredient filters, and multi-select options.

  @prop legend   - Visible group label rendered as a `<legend>` (required).
  @prop options  - Array of `{ label, value, disabled? }` objects (required).
  @prop values   - Currently checked values. Default: `[]`
  @prop disabled - Disables all checkboxes when true. Default: `false`
  @prop onchange - Called with the updated array of checked values on change.

  @example Dietary filters
  <CheckboxGroup
    legend="Dietary needs"
    options={[
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'Vegan', value: 'vegan' },
      { label: 'Gluten-free', value: 'gluten-free' }
    ]}
    values={selected}
    onchange={(v) => (selected = v)}
  />
-->
<script lang="ts">
  import { Checkbox, Label } from '$lib/components/atoms';
  import { Stack, Cluster } from '$lib/components/layouts';

  interface Option {
    label: string;
    value: string;
    disabled?: boolean;
  }

  interface Props {
    legend: string;
    options: Option[];
    values?: string[];
    disabled?: boolean;
    onchange?: (values: string[]) => void;
  }

  let { legend, options, values = [], disabled = false, onchange }: Props = $props();

  const nextGroupId = (() => {
    let n = 0;
    return () => `checkbox-group-${n++}`;
  })();
  const groupId = nextGroupId();

  function handleChange(optionValue: string, checked: boolean) {
    const next = checked ? [...values, optionValue] : values.filter((v) => v !== optionValue);
    onchange?.(next);
  }
</script>

<fieldset data-component="checkbox-group">
  <legend data-checkbox-group-legend>{legend}</legend>
  <Stack space="var(--space-2)">
    {#each options as option (option.value)}
      {@const optionId = `${groupId}-${option.value}`}
      <Cluster space="var(--space-2)" align="center">
        <Checkbox
          id={optionId}
          checked={values.includes(option.value)}
          disabled={disabled || option.disabled}
          onclick={() => handleChange(option.value, !values.includes(option.value))}
        />
        <Label for={optionId}>{option.label}</Label>
      </Cluster>
    {/each}
  </Stack>
</fieldset>

<style>
  [data-component='checkbox-group'] {
    border: none;
    padding: 0;
    margin: 0;
  }

  [data-checkbox-group-legend] {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text);
    margin-block-end: var(--space-2);
  }
</style>
