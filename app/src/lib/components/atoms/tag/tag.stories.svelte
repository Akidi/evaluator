<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tag from './tag.svelte';
  import { expect, fn } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/Tag',
    component: Tag,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story name="Default">Vegetarian</Story>
<Story name="Dismissible" args={{ onremove: fn() }}>Vegetarian</Story>
<Story name="Primary" args={{ variant: 'primary' }}>Primary</Story>
<Story name="Success" args={{ variant: 'success' }}>Success</Story>
<Story name="Warning" args={{ variant: 'warning' }}>Warning</Story>
<Story name="Error" args={{ variant: 'error' }}>Error</Story>

<!-- Tests -->
<Story
  name="Renders a span with data-component"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByText('Pasta');
    expect(el.closest('[data-component="tag"]')).toBeTruthy();
  }}>Pasta</Story
>

<Story
  name="Has no remove button when onremove not provided"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    expect(canvas.queryByRole('button', { name: 'Remove' })).toBeNull();
  }}>Pasta</Story
>

<Story
  name="Shows remove button when onremove provided"
  tags={['!autodocs']}
  args={{ onremove: fn() }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: 'Remove' })).toBeTruthy();
  }}>Pasta</Story
>

<Story
  name="Calls onremove when dismiss clicked"
  tags={['!autodocs']}
  args={{ onremove: fn() }}
  play={async ({ canvas, args }) => {
    await canvas.getByRole('button', { name: 'Remove' }).click();
    expect(args.onremove).toHaveBeenCalledOnce();
  }}>Pasta</Story
>

<Story
  name="Applies data-variant attribute"
  tags={['!dev', '!autodocs']}
  args={{ variant: 'primary' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="tag"]');
    expect(el).toHaveAttribute('data-variant', 'primary');
  }}>Label</Story
>
