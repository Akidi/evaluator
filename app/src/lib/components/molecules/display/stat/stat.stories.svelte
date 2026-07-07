<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Stat from './stat.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Display/Stat',
    component: Stat,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" args={{ value: 320, label: 'Calories' }} />

<Story name="With unit" args={{ value: 32, label: 'Protein', unit: 'g' }} />

<Story name="With currency" args={{ value: 9.99, label: 'Cost', currency: 'USD' }} />

<Story
  name="No unit element when unit absent"
  tags={['!autodocs']}
  args={{ value: 320, label: 'Calories' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-stat-unit]')).toBeNull();
  }}
/>

<Story
  name="Renders unit when provided"
  tags={['!autodocs']}
  args={{ value: 32, label: 'Protein', unit: 'g' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-stat-unit]');
    expect(el).toBeTruthy();
    expect(el?.textContent).toBe('g');
  }}
/>

<Story
  name="Renders value"
  tags={['!autodocs']}
  args={{ value: 320, label: 'Calories' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('320')).toBeTruthy();
  }}
/>

<Story
  name="Renders label"
  tags={['!autodocs']}
  args={{ value: 100, label: 'Calories' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Calories')).toBeTruthy();
  }}
/>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  args={{ value: 100, label: 'Test' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="stat"]')).toBeTruthy();
  }}
/>
