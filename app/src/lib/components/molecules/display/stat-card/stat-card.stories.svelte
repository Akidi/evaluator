<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import StatCard from './stat-card.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Display/StatCard',
    component: StatCard,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" args={{ label: 'Total Orders', value: 1284 }} />

<Story name="With trend up" args={{ label: 'Revenue', value: 48200, trend: 12, suffix: ' USD' }} />

<Story name="With trend down" args={{ label: 'Refunds', value: 34, trend: -8 }} />

<Story name="With suffix" args={{ label: 'Completion rate', value: 94, suffix: '%' }} />

<Story
  name="With description"
  args={{ label: 'Active users', value: 321, description: 'Last 30 days' }}
/>

<!-- Tests -->
<Story
  name="Negative trend has data-trend=down"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Refunds', value: 34, trend: -8 }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-stat-card-trend]');
    expect(el).toHaveAttribute('data-trend', 'down');
  }}
/>

<Story
  name="Positive trend has data-trend=up"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Revenue', value: 100, trend: 12 }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-stat-card-trend]');
    expect(el).toHaveAttribute('data-trend', 'up');
  }}
/>

<Story
  name="Renders label text"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Total Orders', value: 42 }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Total Orders')).toBeTruthy();
  }}
/>

<Story
  name="Renders data-component attribute"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Orders', value: 42 }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="stat-card"]')).toBeTruthy();
  }}
/>
