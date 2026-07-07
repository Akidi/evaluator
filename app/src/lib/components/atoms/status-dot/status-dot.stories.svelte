<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import StatusDot from './status-dot.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/StatusDot',
    component: StatusDot,
    tags: ['autodocs'],
    args: { ariaLabel: 'Online' },
  });
</script>

<Story name="Online" args={{ status: 'online', ariaLabel: 'Online' }} />
<Story name="Offline" args={{ status: 'offline', ariaLabel: 'Offline' }} />
<Story name="Busy" args={{ status: 'busy', ariaLabel: 'Busy' }} />
<Story name="Away" args={{ status: 'away', ariaLabel: 'Away' }} />

<Story
  name="Sets data-status attribute"
  tags={['!autodocs']}
  args={{ status: 'busy', ariaLabel: 'Busy' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="status-dot"]')).toHaveAttribute(
      'data-status',
      'busy',
    );
  }}
/>

<Story
  name="Has aria-label"
  tags={['!autodocs']}
  args={{ status: 'away', ariaLabel: 'James is away' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="status-dot"]')).toHaveAttribute(
      'aria-label',
      'James is away',
    );
  }}
/>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  args={{ status: 'online', ariaLabel: 'Online' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="status-dot"]')).toBeTruthy();
  }}
/>
