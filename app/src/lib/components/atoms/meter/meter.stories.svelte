<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Meter from './meter.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/Meter',
    component: Meter,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story name="Default" args={{ value: 50, label: 'Storage used' }} />

<Story name="Low" args={{ value: 20, label: 'Battery' }} />

<Story name="High" args={{ value: 85, label: 'CPU usage' }} />

<Story name="Custom range" args={{ value: 6, min: 0, max: 10, label: 'Rating' }} />

<Story name="Full" args={{ value: 100, label: 'Complete' }} />

<!-- Tests -->
<Story
  name="Renders a meter element with data-component"
  tags={['!autodocs']}
  args={{ value: 50, label: 'Storage used' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('meter[data-component="meter"]')).toBeTruthy();
  }}
/>

<Story
  name="Has correct value attribute"
  tags={['!dev', '!autodocs']}
  args={{ value: 42, label: 'Storage used' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('meter[data-component="meter"]');
    expect(el).toHaveAttribute('value', '42');
  }}
/>

<Story
  name="Renders label text"
  tags={['!dev', '!autodocs']}
  args={{ value: 50, label: 'Storage used' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Storage used')).toBeTruthy();
  }}
/>

<Story
  name="Label wraps meter element"
  tags={['!dev', '!autodocs']}
  args={{ value: 50, label: 'Storage used' }}
  play={async ({ canvasElement }) => {
    const label = canvasElement.querySelector('label');
    expect(label?.querySelector('meter[data-component="meter"]')).toBeTruthy();
  }}
/>

<Story
  name="Passes low high optimum to meter element"
  tags={['!dev', '!autodocs']}
  args={{ value: 50, low: 25, high: 75, optimum: 50 }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('meter[data-component="meter"]');
    expect(el).toHaveAttribute('low', '25');
    expect(el).toHaveAttribute('high', '75');
    expect(el).toHaveAttribute('optimum', '50');
  }}
/>

<Story
  name="Has correct min and max attributes"
  tags={['!dev', '!autodocs']}
  args={{ value: 6, min: 0, max: 10 }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('meter[data-component="meter"]');
    expect(el).toHaveAttribute('min', '0');
    expect(el).toHaveAttribute('max', '10');
  }}
/>
