<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Cover from './Cover.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Cover',
    component: Cover,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Cover vertically centres a principal element within a minimum-height container. ' +
            'Place an optional header as the **first child** and an optional footer as the **last child** — the middle element is centred. ' +
            'The **background** in these stories is a **visual aid only** — not part of the component.',
        },
      },
    },
    argTypes: {
      minHeight: { control: 'text' },
      space: { control: 'text' },
      noPad: { control: 'boolean' },
      tag: {
        control: { type: 'select' },
        options: ['div', 'section', 'article', 'main'],
      },
    },
  });
</script>

<Story
  name="Default (principal only)"
  args={{ minHeight: '300px', style: 'background: var(--surface-sunken);' }}
  parameters={{
    docs: {
      description: {
        story:
          'Single child is vertically centred within the container. `minHeight` defaults to `100vh` — here reduced to `300px` for the demo.',
      },
    },
  }}
>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; text-align: center;"
  >
    Centred principal content
  </div>
</Story>

<Story
  name="With header and footer"
  args={{ minHeight: '300px', style: 'background: var(--surface-sunken);' }}
  parameters={{
    docs: {
      description: {
        story:
          'Three children: first is pinned to the top, last to the bottom, middle is vertically centred.',
      },
    },
  }}
>
  <div style="background: var(--success-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Header
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; text-align: center;"
  >
    Centred principal content
  </div>
  <div style="background: var(--secondary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Footer
  </div>
</Story>

<Story
  name="No padding"
  args={{ minHeight: '300px', noPad: true, style: 'background: var(--surface-sunken);' }}
  parameters={{
    docs: {
      description: {
        story:
          '`noPad` removes the container padding entirely. The centred element sits flush against the container edges.',
      },
    },
  }}
>
  <div
    style="background: var(--primary-bg-emphasis); padding: 1rem; border-radius: 3px; text-align: center;"
  >
    Centred — no Cover padding
  </div>
</Story>

<Story
  name="Interaction test"
  args={{ 'data-testid': 'cover-root' }}
  parameters={{
    docs: {
      description: {
        story:
          'Verifies `data-layout="cover"` and the default `--cover-min-height` and `--cover-space` CSS variables are applied.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const cover = canvas.getByTestId('cover-root');
    await expect(cover).toBeInTheDocument();
    await expect(cover).toHaveAttribute('data-layout', 'cover');
    await expect(cover).toHaveAttribute(
      'style',
      expect.stringContaining('--cover-min-height: 100vh'),
    );
    await expect(cover).toHaveAttribute(
      'style',
      expect.stringContaining('--cover-space: var(--space-4, 1rem)'),
    );
  }}
>
  <div>Principal</div>
</Story>
