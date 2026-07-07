<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Kbd from './kbd.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Typography/Kbd',
    component: Kbd,
    tags: ['autodocs'],
  });
</script>

<Story name="Default">⌘K</Story>
<Story name="Key combo">Ctrl+S</Story>

<Story
  name="Renders children"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Escape')).toBeTruthy();
  }}>Escape</Story
>

<Story
  name="Renders a kbd element with data-component"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('kbd[data-component="kbd"]')).toBeTruthy();
  }}>Enter</Story
>
