<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Stack from './Stack.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Stack',
    component: Stack,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Stack applies consistent vertical spacing between its direct children using the CSS owl selector (`* + *`). ' +
            'The **background on the Stack itself** and the coloured child blocks are **visual aids only** — they are not part of the component.',
        },
      },
    },
    argTypes: {
      space: { control: 'text' },
      tag: {
        control: { type: 'select' },
        options: [
          'div',
          'section',
          'article',
          'ul',
          'ol',
          'li',
          'main',
          'nav',
          'aside',
          'header',
          'footer',
        ],
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
          'Default spacing using `var(--space-4, 1rem)`. Margin only appears between siblings — never before the first or after the last child.',
      },
    },
  }}
>
  <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Item one
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Item two
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Item three
  </div>
</Story>

<Story
  name="Tight spacing"
  args={{ space: '0.25rem', style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story:
          'Small `space` value for dense lists or related items that should feel closely grouped.',
      },
    },
  }}
>
  <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Item one
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Item two
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Item three
  </div>
</Story>

<Story
  name="Loose spacing"
  args={{ space: '3rem', style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story:
          'Large `space` value for section-level separation where more breathing room is needed.',
      },
    },
  }}
>
  <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Item one
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Item two
  </div>
  <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Item three
  </div>
</Story>

<Story
  name="Interaction test"
  args={{ 'data-testid': 'stack-root' }}
  parameters={{
    docs: {
      description: {
        story:
          'Verifies `data-layout="stack"` is present and the default `--stack-space` CSS variable is applied.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const stack = canvas.getByTestId('stack-root');
    await expect(stack).toBeInTheDocument();
    await expect(stack).toHaveAttribute('data-layout', 'stack');
    await expect(stack).toHaveAttribute(
      'style',
      expect.stringContaining('--stack-space: var(--space-4, 1rem)'),
    );
  }}
>
  <div>Child</div>
</Story>
