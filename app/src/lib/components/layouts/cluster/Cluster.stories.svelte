<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Cluster from './Cluster.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Cluster',
    component: Cluster,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Cluster groups items horizontally with consistent gap and natural wrapping. ' +
            'The **background on the Cluster itself** and the coloured child blocks are **visual aids only** — they are not part of the component.',
        },
      },
    },
    argTypes: {
      space: { control: 'text' },
      justify: {
        control: 'text',
        description: 'justify-content value (e.g. flex-start, center, space-between)',
      },
      align: {
        control: 'text',
        description: 'align-items value (e.g. flex-start, center, stretch)',
      },
      tag: {
        control: { type: 'select' },
        options: ['div', 'section', 'article', 'ul', 'ol', 'nav', 'header', 'footer'],
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
          'Default left-aligned wrapping cluster. Items wrap naturally when they run out of horizontal space.',
      },
    },
  }}
>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag one
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag two
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag three
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag four
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag five
  </div>
</Story>

<Story
  name="Centered"
  args={{ justify: 'center', style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story:
          '`justify="center"` centres items horizontally. Useful for tag clouds or centred button groups.',
      },
    },
  }}
>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag one
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag two
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag three
  </div>
</Story>

<Story
  name="Tight gap"
  args={{ space: '0.25rem', style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story: 'Small `space` value for compact groups like pill filters or inline badges.',
      },
    },
  }}
>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag one
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag two
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag three
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.25rem 0.75rem; border-radius: 999px;"
  >
    Tag four
  </div>
</Story>

<Story
  name="Interaction test"
  args={{ 'data-testid': 'cluster-root' }}
  parameters={{
    docs: {
      description: {
        story:
          'Verifies `data-layout="cluster"` and the default `--cluster-space`, `--cluster-justify`, and `--cluster-align` CSS variables are applied.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const cluster = canvas.getByTestId('cluster-root');
    await expect(cluster).toBeInTheDocument();
    await expect(cluster).toHaveAttribute('data-layout', 'cluster');
    await expect(cluster).toHaveAttribute(
      'style',
      expect.stringContaining('--cluster-space: var(--space-4, 1rem)'),
    );
    await expect(cluster).toHaveAttribute(
      'style',
      expect.stringContaining('--cluster-justify: flex-start'),
    );
    await expect(cluster).toHaveAttribute(
      'style',
      expect.stringContaining('--cluster-align: center'),
    );
  }}
>
  <div>Item</div>
</Story>
