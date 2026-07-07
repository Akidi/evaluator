<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn } from 'storybook/test';
  import InlineNotification from './inline-notification.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Feedback/InlineNotification',
    component: InlineNotification,
    tags: ['autodocs'],
  });
</script>

<Story name="Default">Changes saved automatically.</Story>

<Story name="Success" args={{ status: 'success' }}>Recipe published successfully.</Story>

<Story name="Warning" args={{ status: 'warning' }}>You have unsaved changes.</Story>

<Story name="Error" args={{ status: 'error' }}>Failed to load data.</Story>

<Story name="Dismissible" args={{ status: 'info', dismissible: true, ondismiss: fn() }}>
  Your session will expire soon.
</Story>

<!-- Tests -->
<Story
  name="Renders children content"
  tags={['!dev', '!autodocs']}
  args={{ status: 'info' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Changes saved.')).toBeTruthy();
  }}>Changes saved.</Story
>

<Story
  name="Sets data-status attribute"
  tags={['!dev', '!autodocs']}
  args={{ status: 'error' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="inline-notification"]');
    expect(el).toHaveAttribute('data-status', 'error');
  }}>Error occurred.</Story
>

<Story
  name="Calls ondismiss when dismiss clicked"
  tags={['!dev', '!autodocs']}
  args={{ status: 'info', dismissible: true, ondismiss: fn() }}
  play={async ({ canvas, args }) => {
    canvas.getByRole('button', { name: 'Dismiss' }).click();
    expect(args.ondismiss).toHaveBeenCalledOnce();
  }}>Dismiss me.</Story
>

<Story
  name="Renders data-component attribute"
  tags={['!dev', '!autodocs']}
  args={{ status: 'info' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="inline-notification"]')).toBeTruthy();
  }}>Message</Story
>
