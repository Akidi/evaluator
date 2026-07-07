<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent } from 'storybook/test';
  import Backdrop from './backdrop.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Overlay/Backdrop',
    component: Backdrop,
    tags: ['autodocs'],
  });
</script>

<Story name="Visible" args={{ visible: true }} />
<Story name="Hidden" args={{ visible: false }} />
<Story name="Dismissible" args={{ visible: true, dismissible: true }} />

<Story
  name="Renders div with data-component"
  tags={['!autodocs']}
  args={{ visible: true }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="backdrop"]')).toBeTruthy();
  }}
/>

<Story
  name="Is visible when visible=true"
  tags={['!autodocs']}
  args={{ visible: true }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="backdrop"]');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('data-visible')).toBe('true');
  }}
/>

<Story
  name="Is hidden when visible=false"
  tags={['!autodocs']}
  args={{ visible: false }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="backdrop"]');
    expect(el?.getAttribute('data-visible')).toBe('false');
  }}
/>

<Story
  name="Calls onDismiss when dismissible and clicked"
  tags={['!autodocs']}
  args={{ visible: true, dismissible: true, onDismiss: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('presentation'));
    expect(args.onDismiss).toHaveBeenCalled();
  }}
/>

<Story
  name="Does not call onDismiss when not dismissible"
  tags={['!autodocs']}
  args={{ visible: true, dismissible: false, onDismiss: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('presentation'));
    expect(args.onDismiss).not.toHaveBeenCalled();
  }}
/>
