<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Frame from './Frame.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Frame',
    component: Frame,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Frame constrains its child to a fixed aspect ratio with `overflow: hidden`. ' +
            'Children receive `inline-size: 100%; block-size: 100%; object-fit: cover` so images and videos fill the frame. ' +
            'The **placeholder images** in these stories are **visual aids only** — not part of the component.',
        },
      },
    },
    argTypes: {
      ratio: { control: 'text' },
      tag: {
        control: { type: 'select' },
        options: ['div', 'section', 'article', 'figure'],
      },
    },
  });
</script>

<Story
  name="Default (16/9)"
  parameters={{
    docs: {
      description: {
        story:
          'Default widescreen ratio. `<img>` and `<video>` children fill the frame with `object-fit: cover`; other children are centred.',
      },
    },
  }}
>
  <!-- Tall portrait image (3:4) cropped to widescreen 16:9 — top/bottom clipped -->
  <Frame style="max-width: 400px;">
    <img
      src="https://placehold.co/600x800?text=600x800%0Acropped+to+16%2F9"
      alt="600x800 portrait cropped to 16/9"
    />
  </Frame>
</Story>

<Story
  name="Square (1/1)"
  parameters={{
    docs: {
      description: {
        story:
          'Square crop — useful for avatars, thumbnails, or any content that should occupy equal width and height.',
      },
    },
  }}
>
  <!-- Tall portrait image (2:3) cropped to square 1:1 — top/bottom clipped -->
  <Frame ratio="1/1" style="max-width: 345px;">
    <img
      src="https://placehold.co/600x900?text=600x900%0Acropped+to+1%2F1"
      alt="600x900 portrait cropped to 1/1"
    />
  </Frame>
</Story>

<Story
  name="Portrait (3/4)"
  parameters={{
    docs: {
      description: {
        story:
          'Portrait ratio — suited to product shots or portrait photography where height exceeds width.',
      },
    },
  }}
>
  <Frame ratio="3/4" style="max-width: 345px;">
    <img
      src="https://placehold.co/300x500?text=300x500%0Acropped+to+3%2F4"
      alt="300x500 portrait cropped to 3/4"
    />
  </Frame>
</Story>

<Story
  name="Interaction test"
  parameters={{
    docs: {
      description: {
        story:
          'Verifies `data-layout="frame"` and the default `--frame-ratio` CSS variable are applied.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const frame = canvas.getByTestId('frame-root');
    await expect(frame).toBeInTheDocument();
    await expect(frame).toHaveAttribute('data-layout', 'frame');
    await expect(frame).toHaveAttribute('style', expect.stringContaining('--frame-ratio: 16 / 9'));
  }}
>
  <Frame data-testid="frame-root">
    <div>Media</div>
  </Frame>
</Story>
