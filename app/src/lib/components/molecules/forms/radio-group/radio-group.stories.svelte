<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent } from 'storybook/test';
  import RadioGroup from './radio-group.svelte';

  const mealOptions = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
  ];

  const { Story } = defineMeta({
    title: 'Components/Molecules/Forms/RadioGroup',
    component: RadioGroup,
    tags: ['autodocs'],
    args: {
      name: 'meal-type',
      legend: 'Meal type',
      options: mealOptions,
    },
  });
</script>

<Story name="Default" />

<Story name="With preselected value" args={{ value: 'lunch' }} />

<Story
  name="With disabled option"
  args={{ options: [...mealOptions, { label: 'Snack', value: 'snack', disabled: true }] }}
/>

<Story name="All disabled" args={{ disabled: true }} />

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="radio-group"]')).toBeTruthy();
  }}
/>

<Story
  name="Renders legend text"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Meal type')).toBeTruthy();
  }}
/>

<Story
  name="Clicking option fires onchange with value"
  tags={['!autodocs']}
  args={{ onchange: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Lunch' }));
    expect(args.onchange).toHaveBeenCalledWith('lunch');
  }}
/>

<Story
  name="Preselected radio is checked"
  tags={['!autodocs']}
  args={{ value: 'dinner' }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('radio', { name: 'Dinner' })).toBeChecked();
  }}
/>

<Story
  name="Required marks the options required"
  tags={['!autodocs']}
  args={{ required: true }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('radio', { name: 'Breakfast' })).toBeRequired();
  }}
/>
