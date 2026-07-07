<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Box from './Box.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Box',
    component: Box,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Box provides padding and an optional border around any content. ' +
            'The **background colour on the Box itself** in these stories is a **visual aid only** — ' +
            'it is not part of the component (Box has zero visual styling by design).',
        },
      },
    },
    argTypes: {
      padding: { control: 'text' },
      borderWidth: { control: 'text' },
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
  args={{ style: 'background: var(--primary-bg-emphasis);' }}
  parameters={{
    docs: {
      description: {
        story:
          'Default padding of `var(--space-4, 1rem)`. Box has no visual styling of its own — background here is a visual aid only.',
      },
    },
  }}
>
  <p>Box content with default padding</p>
</Story>

<Story
  name="Large padding"
  args={{ padding: '3rem', style: 'background: var(--primary-bg-emphasis);' }}
  parameters={{
    docs: {
      description: {
        story:
          'Larger `padding` for more spacious content areas like hero sections or callout cards.',
      },
    },
  }}
>
  <p>Box content with large padding</p>
</Story>

<Story
  name="With border"
  args={{ borderWidth: '2px', padding: '1.5rem', style: 'background: var(--primary-bg-emphasis);' }}
  parameters={{
    docs: {
      description: {
        story:
          '`borderWidth` enables a solid border. Apply `border-color` via `style` or a parent class — Box does not set a colour by design.',
      },
    },
  }}
>
  <p>Box content with border</p>
</Story>

<Story
  name="Interaction test"
  args={{ 'data-testid': 'box-root' }}
  parameters={{
    docs: {
      description: {
        story:
          'Verifies `data-layout="box"` and the default `--box-padding` CSS variable are applied.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const box = canvas.getByTestId('box-root');
    await expect(box).toBeInTheDocument();
    await expect(box).toHaveAttribute('data-layout', 'box');
    await expect(box).toHaveAttribute(
      'style',
      expect.stringContaining('--box-padding: var(--space-4, 1rem)'),
    );
  }}
>
  <p>Child</p>
</Story>
