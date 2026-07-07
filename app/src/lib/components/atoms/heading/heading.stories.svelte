<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Heading from './heading.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Typography/Heading',
    component: Heading,
    tags: ['autodocs'],
    argTypes: {
      level: {
        control: 'inline-radio',
        options: [1, 2, 3, 4, 5, 6],
        description: 'Semantic heading level — determines the rendered HTML element.',
        table: { defaultValue: { summary: '2' } },
      },
      size: {
        control: 'select',
        options: [undefined, '2xl', 'xl', 'lg', 'md', 'sm', 'xs'],
        description: 'Visual size, independent of semantic level. Defaults to match the level.',
      },
    },
  });
</script>

<Story name="H1" args={{ level: 1 }}>The quick brown fox</Story>

<Story name="H2" args={{ level: 2 }}>The quick brown fox</Story>

<Story name="H3" args={{ level: 3 }}>The quick brown fox</Story>

<Story name="H4" args={{ level: 4 }}>The quick brown fox</Story>

<Story name="H5" args={{ level: 5 }}>The quick brown fox</Story>

<Story name="H6" args={{ level: 6 }}>The quick brown fox</Story>

<Story name="Visual size overrides level" args={{ level: 3, size: 'xl' }}>H3 styled as XL</Story>

<Story
  name="Renders the correct semantic element"
  tags={['!autodocs']}
  args={{ level: 1, 'data-testid': 'heading-semantic' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('heading-semantic');
    expect(el.tagName.toLowerCase()).toBe('h1');
  }}
>
  Semantic check
</Story>

<Story
  name="Defaults to h2"
  tags={['!autodocs']}
  args={{ 'data-testid': 'heading-default' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('heading-default');
    expect(el.tagName.toLowerCase()).toBe('h2');
  }}
>
  Default heading
</Story>

<Story
  name="Content is rendered"
  tags={['!autodocs']}
  args={{ level: 2, 'data-testid': 'heading-content' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('heading-content');
    expect(el).toHaveTextContent('Hello world');
  }}
>
  Hello world
</Story>

<Story
  name="Aria label is forwarded"
  tags={['!autodocs']}
  args={{ level: 2, 'data-testid': 'heading-aria', 'aria-label': 'Section title' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('heading-aria');
    expect(el).toHaveAttribute('aria-label', 'Section title');
  }}
>
  Section
</Story>
