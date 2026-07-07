<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import RelativeTime from './relative-time.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Typography/RelativeTime',
    component: RelativeTime,
    tags: ['autodocs'],
  });

  const now = new Date();
  const minsAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const hoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
  const lastYear = new Date(now.getFullYear() - 1, 0, 15);
</script>

<Story name="Just now" args={{ datetime: now }} />

<Story name="Minutes ago" args={{ datetime: minsAgo }} />

<Story name="Hours ago" args={{ datetime: hoursAgo }} />

<Story name="Yesterday" args={{ datetime: yesterday }} />

<Story name="Last week" args={{ datetime: lastWeek }} />

<Story name="Last year" args={{ datetime: lastYear }} />

<!-- Tests -->
<Story
  name="Shows weeks for dates 7+ days ago"
  tags={['!dev', '!autodocs']}
  args={{ datetime: lastWeek }}
  play={async ({ canvas }) => {
    expect(canvas.getByText(/week/i)).toBeTruthy();
  }}
/>

<Story
  name="Shows just now for very recent dates"
  tags={['!dev', '!autodocs']}
  args={{ datetime: now }}
  play={async ({ canvas }) => {
    expect(canvas.getByText(/now|second/i)).toBeTruthy();
  }}
/>

<Story
  name="Renders relative time text"
  tags={['!dev', '!autodocs']}
  args={{ datetime: minsAgo }}
  play={async ({ canvas }) => {
    const el = canvas.getByText(/ago/i);
    expect(el).toBeTruthy();
  }}
/>

<Story
  name="Sets datetime attribute to ISO string"
  tags={['!dev', '!autodocs']}
  args={{ datetime: minsAgo }}
  play={async ({ canvasElement, args }) => {
    const el = canvasElement.querySelector('time[data-component="relative-time"]');
    expect(el).toHaveAttribute('datetime', (args.datetime as Date).toISOString());
  }}
/>

<Story
  name="Renders a time element with data-component"
  tags={['!dev', '!autodocs']}
  args={{ datetime: minsAgo }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('time[data-component="relative-time"]')).toBeTruthy();
  }}
/>
