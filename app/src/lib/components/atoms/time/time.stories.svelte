<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Time from './time.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Typography/Time',
    component: Time,
    tags: ['autodocs'],
    args: { date: '2026-01-15T12:00:00Z' },
  });
</script>

<Story name="Date" args={{ date: '2026-01-15T12:00:00Z', format: 'date' }} />
<Story name="Time" args={{ date: '2026-01-15T12:00:00Z', format: 'time' }} />
<Story name="Datetime" args={{ date: '2026-01-15T12:00:00Z', format: 'datetime' }} />

<Story
  name="Relative"
  args={{ date: new Date(Date.now() - 3600000).toISOString(), format: 'relative' }}
/>

<Story
  name="Sets datetime attribute to ISO string"
  tags={['!autodocs']}
  args={{ date: '2026-01-15T12:00:00Z', format: 'date' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('time');
    expect(el?.getAttribute('datetime')).toBe('2026-01-15T12:00:00.000Z');
  }}
/>

<Story
  name="Renders a time element with data-component"
  tags={['!autodocs']}
  args={{ date: '2026-01-15T12:00:00Z', format: 'date' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('time[data-component="time"]')).toBeTruthy();
  }}
/>
