<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import FeedbackDot from './feedback-dot.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/FeedbackDot',
    component: FeedbackDot,
    tags: ['autodocs'],
  });
</script>

<!-- Visual -->
<Story name="Default" args={{ status: 'default' }} />
<Story name="Success" args={{ status: 'success' }} />
<Story name="Warning" args={{ status: 'warning' }} />
<Story name="Error" args={{ status: 'error' }} />
<Story name="Info" args={{ status: 'info' }} />

<!-- Tests -->
<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  args={{ status: 'default' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="feedback-dot"]')).toBeTruthy();
  }}
/>

<Story
  name="Is aria-hidden"
  tags={['!autodocs']}
  args={{ status: 'default' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="feedback-dot"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  }}
/>

<Story
  name="Applies status as data-status attribute"
  tags={['!autodocs']}
  args={{ status: 'error' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="feedback-dot"]')).toHaveAttribute(
      'data-status',
      'error',
    );
  }}
/>

<Story
  name="Default status is default"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="feedback-dot"]')).toHaveAttribute(
      'data-status',
      'default',
    );
  }}
/>
