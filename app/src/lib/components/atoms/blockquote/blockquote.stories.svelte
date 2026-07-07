<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Blockquote from './blockquote.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Typography/Blockquote',
    component: Blockquote,
    tags: ['autodocs'],
  });
</script>

<Story name="Default">Eating well is a form of self-respect.</Story>

<Story name="With cite" args={{ cite: 'https://example.com' }}
  >Nutrition is the foundation of performance.</Story
>

<Story
  name="Renders a blockquote element"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('blockquote[data-component="blockquote"]')).toBeTruthy();
  }}>Quote text</Story
>

<Story
  name="Forwards cite attribute"
  args={{ cite: 'https://example.com' }}
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('blockquote')).toHaveAttribute(
      'cite',
      'https://example.com',
    );
  }}>Quote text</Story
>

<Story
  name="Renders children"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Children content')).toBeTruthy();
  }}>Children content</Story
>
