<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent } from 'storybook/test';
  import AlertBanner from './alert-banner.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Feedback/AlertBanner',
    component: AlertBanner,
    tags: ['autodocs'],
    args: {
      variant: 'info',
      dismissible: false,
    },
  });
</script>

<Story name="Info" args={{ variant: 'info' }}>Your recipe has been saved as a draft.</Story>

<Story name="Success" args={{ variant: 'success', title: 'Recipe published!' }}>
  Your recipe is now visible to all users.
</Story>

<Story name="Warning" args={{ variant: 'warning', title: 'Missing fields' }}>
  Please add cooking time before publishing.
</Story>

<Story name="Error" args={{ variant: 'error', title: 'Save failed' }}>
  Could not save your recipe. Please try again.
</Story>

<Story name="Dismissible" args={{ variant: 'success', dismissible: true }}
  >Recipe saved successfully.</Story
>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  args={{ variant: 'info' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="alert-banner"]')).toBeTruthy();
  }}>Message</Story
>

<Story
  name="Has role=alert"
  tags={['!autodocs']}
  args={{ variant: 'error' }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('alert')).toBeTruthy();
  }}>Error message</Story
>

<Story
  name="Has data-variant attribute"
  tags={['!autodocs']}
  args={{ variant: 'warning' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="alert-banner"]');
    expect(el).toHaveAttribute('data-variant', 'warning');
  }}>Warning message</Story
>

<Story
  name="Dismiss button fires ondismiss"
  tags={['!autodocs']}
  args={{ variant: 'info', dismissible: true, ondismiss: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /dismiss/i }));
    expect(args.ondismiss).toHaveBeenCalledOnce();
  }}>Message</Story
>
