<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent } from 'storybook/test';
  import ConfirmDialog from './confirm-dialog.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Feedback/ConfirmDialog',
    component: ConfirmDialog,
    tags: ['autodocs'],
    args: { title: 'Delete recipe', description: 'This action cannot be undone.', open: true },
  });
</script>

<Story name="Default" />

<Story
  name="Danger"
  args={{ variant: 'danger', title: 'Delete recipe', description: 'This action cannot be undone.' }}
/>

<Story name="Closed" args={{ open: false }} />

<!-- Tests -->

<Story
  name="Has data-component attribute"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="confirm-dialog"]')).toBeTruthy();
  }}
/>

<Story
  name="Dialog is not open by default"
  tags={['!dev', '!autodocs']}
  args={{ open: false }}
  play={async ({ canvasElement }) => {
    const dialog = canvasElement.querySelector(
      '[data-component="confirm-dialog"]',
    ) as HTMLDialogElement;
    expect(dialog.open).toBe(false);
  }}
/>

<Story
  name="Danger variant sets data-variant on root"
  tags={['!dev', '!autodocs']}
  args={{ variant: 'danger' }}
  play={async ({ canvasElement }) => {
    const dialog = canvasElement.querySelector('[data-component="confirm-dialog"]')!;
    expect(dialog).toHaveAttribute('data-variant', 'danger');
  }}
/>

<Story
  name="Cancel button calls oncancel"
  tags={['!dev', '!autodocs']}
  args={{ oncancel: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /cancel/i }));
    expect(args.oncancel).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Confirm button calls onconfirm"
  tags={['!dev', '!autodocs']}
  args={{ onconfirm: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /confirm/i }));
    expect(args.onconfirm).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Renders title and description"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    const dialog = canvasElement.querySelector('[data-component="confirm-dialog"]')!;
    expect(dialog).toHaveTextContent('Delete recipe');
    expect(dialog).toHaveTextContent('This action cannot be undone.');
  }}
/>
