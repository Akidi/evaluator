<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Grid from './Grid.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Grid',
    component: Grid,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Grid creates a responsive auto-filling grid using CSS `minmax`. ' +
            'The **background on the Grid itself** and the coloured child blocks are **visual aids only** — they are not part of the component.',
        },
      },
    },
    argTypes: {
      min: { control: 'text' },
      space: { control: 'text' },
      tag: {
        control: { type: 'select' },
        options: ['div', 'section', 'article', 'ul', 'ol', 'main'],
      },
    },
  });
</script>

<Story
  name="Default"
  args={{ style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story:
          'Auto-filling grid with default `min="250px"`. Columns are added and removed automatically as the container width changes.',
      },
    },
  }}
>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 1
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 2
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 3
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 4
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 5
  </div>
</Story>

<Story
  name="Large min width"
  args={{ min: '350px', style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story:
          '`min="350px"` produces fewer, wider columns. Fewer items fit per row before the grid reflows.',
      },
    },
  }}
>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 1
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 2
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 3
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 4
  </div>
</Story>

<Story
  name="Tight gap"
  args={{ space: '0.25rem', style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story: 'Small `space` value for dense grids like image galleries or compact card sets.',
      },
    },
  }}
>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 1
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 2
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 3
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item 4
  </div>
</Story>

<Story
  name="Interaction test"
  args={{ 'data-testid': 'grid-root' }}
  parameters={{
    docs: {
      description: {
        story:
          'Verifies `data-layout="grid"` and the default `--grid-min` and `--grid-space` CSS variables are applied.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const grid = canvas.getByTestId('grid-root');
    await expect(grid).toBeInTheDocument();
    await expect(grid).toHaveAttribute('data-layout', 'grid');
    await expect(grid).toHaveAttribute('style', expect.stringContaining('--grid-min: 250px'));
    await expect(grid).toHaveAttribute(
      'style',
      expect.stringContaining('--grid-space: var(--space-4, 1rem)'),
    );
  }}
>
  <div>Item</div>
</Story>
