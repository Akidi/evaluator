<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Switcher from './Switcher.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Switcher',
    component: Switcher,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Switcher lays children side-by-side above `threshold` total width and stacks them below it — no media queries needed. ' +
            '`threshold` is the minimum **total container width** at which items switch to side-by-side (not a CSS breakpoint). ' +
            'The **background** and **coloured panels** are **visual aids only** — not part of the component.',
        },
      },
    },
    argTypes: {
      threshold: {
        control: 'text',
        description: 'Total container width at which items switch to side-by-side (e.g. 30rem)',
      },
      space: { control: 'text' },
      tag: {
        control: { type: 'select' },
        options: ['div', 'section', 'article', 'ul', 'ol'],
      },
    },
  });
</script>

<Story
  name="Default (2 items)"
  args={{ style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story:
          'Two items side-by-side above `30rem` total container width, stacked below it. Resize the canvas to see the switch.',
      },
    },
  }}
>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item one
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item two
  </div>
</Story>

<Story
  name="High threshold (60rem — stacks unless viewport is very wide)"
  args={{ threshold: '60rem', style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story:
          'A high `threshold` keeps items stacked in most viewport sizes. Useful for layouts that should only go side-by-side on very wide screens.',
      },
    },
  }}
>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item one
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item two
  </div>
</Story>

<Story
  name="Three items"
  args={{ style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story:
          'Three items share the row equally above threshold. All three stack below it — no intermediate two-column state.',
      },
    },
  }}
>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item one
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item two
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
    Item three
  </div>
</Story>

<Story
  name="Interaction test"
  args={{ 'data-testid': 'switcher-root' }}
  parameters={{
    docs: {
      description: {
        story:
          'Verifies `data-layout="switcher"` and the default `--switcher-threshold` and `--switcher-space` CSS variables are applied.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const switcher = canvas.getByTestId('switcher-root');
    await expect(switcher).toBeInTheDocument();
    await expect(switcher).toHaveAttribute('data-layout', 'switcher');
    await expect(switcher).toHaveAttribute(
      'style',
      expect.stringContaining('--switcher-threshold: 30rem'),
    );
    await expect(switcher).toHaveAttribute(
      'style',
      expect.stringContaining('--switcher-space: var(--space-4, 1rem)'),
    );
  }}
>
  <div>Item</div>
</Story>
