<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Code from './code.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Typography/Code',
    component: Code,
    tags: ['autodocs'],
  });
</script>

<Story name="Default">console.log('hello')</Story>
<Story name="Variable name">macros.protein</Story>

<Story
  name="Renders children"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    expect(canvas.getByText('const x = 1')).toBeTruthy();
  }}>const x = 1</Story
>

<Story
  name="Renders a code element with data-component"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('code[data-component="code"]')).toBeTruthy();
  }}>null</Story
>
