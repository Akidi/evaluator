<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import PageShell from './PageShell.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/PageShell',
    component: PageShell,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'PageShell is the shared page content column. It centers content up to `--page-max` ' +
            'and keeps side gutters, giving marketing, dashboard, and admin sections one consistent gap. ' +
            'Composes `Center`. Place it inside a full-bleed wrapper to constrain just the content.',
        },
      },
    },
  });
</script>

<Story
  name="Default"
  parameters={{
    docs: {
      description: {
        story:
          'Default column centred to `var(--page-max)` with `var(--space-6)` gutters and vertical padding.',
      },
    },
  }}
>
  <p style="background: var(--primary-bg); padding: var(--space-4);">Centered page content</p>
</Story>

<Story
  name="Unpadded"
  args={{ padded: false }}
  parameters={{
    docs: {
      description: {
        story:
          '`padded={false}` drops the vertical padding — use inside a full-bleed section that owns its own `padding-block`.',
      },
    },
  }}
>
  <p style="background: var(--primary-bg); padding: var(--space-4);">No vertical padding</p>
</Story>

<Story
  name="Custom max width"
  args={{ max: '40rem' }}
  parameters={{
    docs: { description: { story: '`max="40rem"` — narrower column for a tighter layout.' } },
  }}
>
  <p style="background: var(--primary-bg); padding: var(--space-4);">Max 40rem</p>
</Story>

<Story
  name="Renders the centered column element"
  parameters={{
    docs: {
      description: {
        story:
          'Verifies content is wrapped in a `data-layout="center"` element from the composed Center.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('shell-content');
    expect(el.closest('[data-layout="center"]')).toHaveAttribute('data-layout', 'center');
  }}
>
  <span data-testid="shell-content" style="background: var(--primary-bg); padding: var(--space-2);"
    >content</span
  >
</Story>
