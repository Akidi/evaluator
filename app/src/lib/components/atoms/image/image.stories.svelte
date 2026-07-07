<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Image from './image.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Media/Image',
    component: Image,
    tags: ['autodocs'],
    args: { src: 'https://placehold.co/400x300', alt: 'Placeholder image' },
  });
</script>

<Story name="Default" args={{ src: 'https://placehold.co/400x300', alt: 'Placeholder image' }} />

<Story
  name="With caption"
  args={{ src: 'https://placehold.co/400x300', alt: 'Food photo', caption: 'A delicious meal' }}
/>

<Story
  name="With aspect ratio"
  args={{ src: 'https://placehold.co/400x300', alt: 'Square image', aspectRatio: '1 / 1' }}
/>

<Story
  name="With fallback"
  args={{
    src: 'broken-url',
    alt: 'Broken image',
    fallback: 'https://placehold.co/400x300/ccc/999?text=No+Image',
  }}
/>

<Story
  name="Renders figure element"
  tags={['!autodocs']}
  args={{ src: 'https://placehold.co/400x300', alt: 'Test image' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('figure[data-component="image"]')).toBeTruthy();
  }}
/>

<Story
  name="Renders img element with correct alt"
  tags={['!autodocs']}
  args={{ src: 'https://placehold.co/400x300', alt: 'Test image' }}
  play={async ({ canvasElement }) => {
    const img = canvasElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('alt')).toBe('Test image');
  }}
/>

<Story
  name="Renders figcaption when caption provided"
  tags={['!autodocs']}
  args={{ src: 'https://placehold.co/400x300', alt: 'Test', caption: 'Caption text' }}
  play={async ({ canvasElement }) => {
    const caption = canvasElement.querySelector('figcaption');
    expect(caption).toBeTruthy();
    expect(caption?.textContent?.trim()).toBe('Caption text');
  }}
/>

<Story
  name="No figcaption without caption"
  tags={['!autodocs']}
  args={{ src: 'https://placehold.co/400x300', alt: 'Test' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('figcaption')).toBeNull();
  }}
/>
