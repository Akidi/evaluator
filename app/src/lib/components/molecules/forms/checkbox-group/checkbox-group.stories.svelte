<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent } from 'storybook/test';
  import CheckboxGroup from './checkbox-group.svelte';

  const dietaryOptions = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten-free', value: 'gluten-free' },
  ];

  const { Story } = defineMeta({
    title: 'Components/Molecules/Forms/CheckboxGroup',
    component: CheckboxGroup,
    tags: ['autodocs'],
    args: {
      legend: 'Dietary preferences',
      options: dietaryOptions,
    },
  });
</script>

<Story name="Default" />

<Story name="With preselected values" args={{ values: ['vegetarian', 'vegan'] }} />

<Story name="All disabled" args={{ disabled: true }} />

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="checkbox-group"]')).toBeTruthy();
  }}
/>

<Story
  name="Preselected checkboxes are checked"
  tags={['!autodocs']}
  args={{ values: ['vegetarian', 'vegan'] }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('checkbox', { name: 'Vegetarian' })).toBeChecked();
    expect(canvas.getByRole('checkbox', { name: 'Vegan' })).toBeChecked();
    expect(canvas.getByRole('checkbox', { name: 'Gluten-free' })).not.toBeChecked();
  }}
/>

<Story
  name="Checking an option fires onchange with updated values"
  tags={['!autodocs']}
  args={{ onchange: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Vegan' }));
    expect(args.onchange).toHaveBeenCalledWith(['vegan']);
  }}
/>

<Story
  name="Unchecking removes value from array"
  tags={['!autodocs']}
  args={{ values: ['vegetarian', 'vegan'], onchange: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Vegetarian' }));
    expect(args.onchange).toHaveBeenCalledWith(['vegan']);
  }}
/>
