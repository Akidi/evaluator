<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Center from './Center.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Center',
    component: Center,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Center horizontally centres its content up to a maximum width using `margin-inline: auto`. ' +
            'Use `gutters` to ensure minimum side padding on narrow screens. ' +
            'Use `intrinsic` to centre children (like buttons) rather than the block itself.',
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
          'Default centred column with `max` of `var(--measure, 60ch)`. The column is as wide as its content up to the max.',
      },
    },
  }}
>
  <p style="background: var(--primary-bg); padding: var(--space-4);">
    Centered column, default 60ch max
  </p>
</Story>

<Story
  name="Custom max width"
  args={{ max: '40ch' }}
  parameters={{
    docs: { description: { story: '`max="40ch"` — narrower column for tighter reading widths.' } },
  }}
>
  <p style="background: var(--primary-bg); padding: var(--space-4);">Max 40ch</p>
</Story>

<Story
  name="With gutters"
  args={{ max: '60ch', gutters: 'var(--space-4)' }}
  parameters={{
    docs: {
      description: {
        story:
          '`gutters` adds minimum padding on each side. Prevents content touching viewport edges when the container is narrow.',
      },
    },
  }}
>
  <p style="background: var(--primary-bg); padding: var(--space-4);">
    Has minimum side padding even at narrow widths
  </p>
</Story>

<Story
  name="Intrinsic centering"
  args={{ intrinsic: true }}
  parameters={{
    docs: {
      description: {
        story:
          '`intrinsic` switches to `flex-direction: column; align-items: center` so children like buttons centre to their own width rather than stretching full-width.',
      },
    },
  }}
>
  <p style="background: var(--primary-bg); padding: var(--space-4);">
    Full-width paragraph stays full-width
  </p>
  <button style="padding: var(--space-2) var(--space-4);">Button centers intrinsically</button>
</Story>

<Story
  name="Has data-layout=center attribute"
  parameters={{
    docs: {
      description: {
        story: 'Verifies the `data-layout="center"` attribute is present on the rendered element.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('center-el');
    expect(el.closest('[data-layout="center"]')).toHaveAttribute('data-layout', 'center');
  }}
>
  <span data-testid="center-el" style="background: var(--primary-bg); padding: var(--space-2);"
    >content</span
  >
</Story>

<Story
  name="Intrinsic prop sets data-intrinsic attribute"
  args={{ intrinsic: true }}
  parameters={{
    docs: {
      description: {
        story: 'Verifies the `data-intrinsic` attribute is present when `intrinsic` is set.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('intrinsic-el');
    expect(el.closest('[data-layout="center"]')).toHaveAttribute('data-intrinsic', '');
  }}
>
  <span data-testid="intrinsic-el">content</span>
</Story>
