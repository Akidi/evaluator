<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Imposter from './Imposter.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Imposter',
    component: Imposter,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Imposter positions an element absolutely (or fixedly) centred within its nearest positioned ancestor. ' +
            '**The containing element must have `position: relative`** (or another non-static position) for absolute mode to work. ' +
            'Use `fixed` prop for viewport-relative overlays (modals, toasts). ' +
            'The **grey container** in these stories has `position: relative` set as a visual aid — not part of the component.',
        },
      },
    },
    argTypes: {
      fixed: { control: 'boolean' },
      margin: {
        control: 'text',
        description: 'Space between overlay and container edges (e.g. 1rem)',
      },
      tag: {
        control: { type: 'select' },
        options: ['div', 'section', 'aside'],
      },
    },
  });
</script>

<Story
  name="Default (centred in container)"
  parameters={{
    docs: {
      description: {
        story:
          'Centred absolutely within the nearest `position: relative` ancestor. The grey container has `position: relative` set as a visual aid.',
      },
    },
  }}
>
  <div style="position: relative; background: var(--surface-sunken); height: 200px; width: 100%;">
    <Imposter>
      <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
        Centred overlay
      </div>
    </Imposter>
  </div>
</Story>

<Story
  name="With margin"
  parameters={{
    docs: {
      description: {
        story:
          '`margin` sets the minimum distance between the overlay edges and the container edges. Prevents the overlay from reaching right to the boundary.',
      },
    },
  }}
>
  <div style="position: relative; background: var(--surface-sunken); height: 200px; width: 100%;">
    <Imposter margin="1rem">
      <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
        Overlay with margin
      </div>
    </Imposter>
  </div>
</Story>

<Story
  name="Large content (overflow scroll)"
  parameters={{
    docs: {
      description: {
        story:
          'When content exceeds the container minus `margin`, the Imposter scrolls internally rather than overflowing its container.',
      },
    },
  }}
>
  <div style="position: relative; background: var(--surface-sunken); height: 200px; width: 300px;">
    <Imposter margin="0.5rem">
      <div style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px;">
        <p>Content taller than container scrolls within the overlay.</p>
        <p>Line 2</p>
        <p>Line 3</p>
        <p>Line 4</p>
        <p>Line 5</p>
      </div>
    </Imposter>
  </div>
</Story>

<Story
  name="Interaction test"
  parameters={{
    docs: {
      description: {
        story:
          'Verifies `data-layout="imposter"`, the default `--imposter-margin` CSS variable, and that `data-fixed` is absent when `fixed` is not set.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const imposter = canvas.getByTestId('imposter-root');
    await expect(imposter).toBeInTheDocument();
    await expect(imposter).toHaveAttribute('data-layout', 'imposter');
    await expect(imposter).toHaveAttribute(
      'style',
      expect.stringContaining('--imposter-margin: 2rem'),
    );
    await expect(imposter).not.toHaveAttribute('data-fixed');
  }}
>
  <div style="position: relative; background: var(--surface-sunken); height: 100px;">
    <Imposter data-testid="imposter-root">
      <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
        Content
      </div>
    </Imposter>
  </div>
</Story>
