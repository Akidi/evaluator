<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import TimelineItem from './timeline-item.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Display/TimelineItem',
    component: TimelineItem,
    tags: ['autodocs'],
  });

  const now = new Date();
  const minsAgo = new Date(now.getTime() - 10 * 60 * 1000);
  const hoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
</script>

<Story name="Default" args={{ label: 'Order placed', datetime: now }} />

<Story
  name="With description"
  args={{ label: 'Payment confirmed', description: 'Visa ending 4242', datetime: minsAgo }}
/>

<Story
  name="Success"
  args={{ label: 'Shipped', description: 'Tracking #1Z999', datetime: hoursAgo, status: 'success' }}
/>

<Story
  name="Error"
  args={{
    label: 'Delivery failed',
    description: 'Recipient unavailable',
    datetime: hoursAgo,
    status: 'error',
  }}
/>

<Story
  name="Warning"
  args={{
    label: 'Delayed',
    description: 'Weather conditions',
    datetime: minsAgo,
    status: 'warning',
  }}
/>

<!-- Tests -->
<Story
  name="Renders label text"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Order placed', datetime: now }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Order placed')).toBeTruthy();
  }}
/>

<Story
  name="Renders relative time"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Order placed', datetime: minsAgo }}
  play={async ({ canvas }) => {
    expect(canvas.getByText(/ago/i)).toBeTruthy();
  }}
/>

<Story
  name="Sets data-status attribute"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Shipped', datetime: now, status: 'success' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="timeline-item"]');
    expect(el).toHaveAttribute('data-status', 'success');
  }}
/>

<Story
  name="Renders data-component attribute"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Order placed', datetime: now }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="timeline-item"]')).toBeTruthy();
  }}
/>
