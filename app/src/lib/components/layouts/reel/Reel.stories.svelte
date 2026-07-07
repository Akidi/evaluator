<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Reel from './Reel.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Reel',
    component: Reel,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Reel creates a horizontal scrolling row. Items have a fixed width via `--reel-item-width`; the row scrolls when items overflow. ' +
            'The **background** and **coloured cards** are **visual aids only** — not part of the component.',
        },
      },
    },
    argTypes: {
      itemWidth: { control: 'text' },
      height: { control: 'text' },
      space: { control: 'text' },
      noBar: { control: 'boolean' },
      tag: {
        control: { type: 'select' },
        options: ['div', 'section', 'article', 'ul', 'ol'],
      },
    },
  });
</script>

<Story
  name="Default"
  args={{
    itemWidth: '200px',
    style: 'background: var(--surface-sunken); padding: 0.5rem; max-width: 600px;',
  }}
  parameters={{
    docs: {
      description: {
        story:
          'Horizontally scrolling row with `itemWidth="200px"`. Items overflow the container and scroll horizontally. The container is capped at `600px` for the demo.',
      },
    },
  }}
>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 1
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 2
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 3
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 4
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 5
  </div>
</Story>

<Story
  name="No scrollbar"
  args={{
    itemWidth: '200px',
    noBar: true,
    style: 'background: var(--surface-sunken); padding: 0.5rem; max-width: 600px;',
  }}
  parameters={{
    docs: {
      description: {
        story:
          '`noBar` hides the scrollbar visually. The reel is still scrollable via touch/mouse — useful for cleaner UI where the overflow is implied.',
      },
    },
  }}
>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 1
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 2
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 3
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 4
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 5
  </div>
</Story>

<Story
  name="Tight gap"
  args={{
    itemWidth: '200px',
    space: '0.25rem',
    style: 'background: var(--surface-sunken); padding: 0.5rem; max-width: 600px;',
  }}
  parameters={{
    docs: {
      description: {
        story:
          'Small `space` value for tightly packed reels like image strips or compact carousels.',
      },
    },
  }}
>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 1
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 2
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 3
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; flex-shrink: 0;"
  >
    Card 4
  </div>
</Story>

<Story
  name="Interaction test"
  args={{ 'data-testid': 'reel-root' }}
  parameters={{
    docs: {
      description: {
        story:
          'Verifies `data-layout="reel"` and the default `--reel-item-width` and `--reel-space` CSS variables are applied.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const reel = canvas.getByTestId('reel-root');
    await expect(reel).toBeInTheDocument();
    await expect(reel).toHaveAttribute('data-layout', 'reel');
    await expect(reel).toHaveAttribute('style', expect.stringContaining('--reel-item-width: auto'));
    await expect(reel).toHaveAttribute(
      'style',
      expect.stringContaining('--reel-space: var(--space-4, 1rem)'),
    );
  }}
>
  <div>Item</div>
</Story>
