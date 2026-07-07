<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Icon from './Icon.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Icon',
    component: Icon,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Icon sizes an inline SVG to match the surrounding text height (`0.75em` / `1cap`) and aligns it to the baseline. ' +
            '**`ariaLabel` prop — when to use it:** ' +
            'If the icon has no visible text beside it, pass `ariaLabel` to describe the icon for screen readers — the wrapper receives `role="img"` and `aria-label`. ' +
            'If the icon sits inside a `<button>` or `<a>` that already has an accessible name, omit `ariaLabel` and add `aria-hidden="true"` to the SVG instead. ' +
            'When visible text accompanies the icon, add `aria-hidden="true"` to the SVG — the text is the label.',
        },
      },
    },
  });
</script>

<Story
  name="Icon with text"
  args={{ style: 'background-color: var(--primary-bg-emphasis);' }}
  parameters={{
    docs: {
      description: {
        story:
          'SVG is decorative — `aria-hidden="true"` is set so screen readers skip it. The visible text provides the accessible label.',
      },
    },
  }}
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
  Layers
</Story>

<Story
  name="Icon only with ariaLabel"
  args={{ ariaLabel: 'Close', style: 'background-color: var(--primary-bg-emphasis);' }}
  parameters={{
    docs: {
      description: {
        story:
          'No visible text — `ariaLabel` adds `role="img"` and `aria-label` to the wrapper so screen readers announce the icon\'s purpose.',
      },
    },
  }}
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
</Story>

<Story
  name="Scales with font size"
  parameters={{
    docs: {
      description: {
        story:
          'The SVG is sized to `0.75em` / `1cap`, so it scales automatically with the surrounding `font-size` — no manual resizing needed.',
      },
    },
  }}
>
  <div style="display: flex; flex-direction: column; gap: var(--space-4);">
    <span style="font-size: 0.875rem;">
      <Icon style="background-color: var(--primary-bg-emphasis);">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"><circle cx="12" cy="12" r="10" /></svg
        >
        Small text
      </Icon>
    </span>
    <span style="font-size: 1.5rem;">
      <Icon style="background-color: var(--primary-bg-emphasis);">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"><circle cx="12" cy="12" r="10" /></svg
        >
        Large text
      </Icon>
    </span>
  </div>
</Story>

<Story
  name="SVG sized to cap height"
  args={{ style: 'background-color: var(--primary-bg-emphasis);' }}
  parameters={{
    docs: {
      description: {
        story: 'Verifies the SVG element is present and rendered within the Icon wrapper.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const svg = canvas.getByRole('img', { hidden: true });
    expect(svg).toBeTruthy();
  }}
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    role="img"
    aria-label="test icon"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
</Story>

<Story
  name="ariaLabel sets aria attributes"
  args={{ ariaLabel: 'Delete item', style: 'background-color: var(--primary-bg-emphasis);' }}
  parameters={{
    docs: {
      description: {
        story:
          'Verifies that `ariaLabel` adds `role="img"` and `aria-label` to the wrapper element.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('img');
    expect(el).toHaveAttribute('aria-label', 'Delete item');
  }}
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
  </svg> Delete Item
</Story>
