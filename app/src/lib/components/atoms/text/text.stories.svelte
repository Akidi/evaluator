<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Text from './text.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Typography/Text',
    component: Text,
    tags: ['autodocs'],
    argTypes: {
      as: {
        control: 'inline-radio',
        options: ['p', 'span', 'small', 'div'],
        description: 'HTML element to render.',
        table: { defaultValue: { summary: '"p"' } },
      },
      size: {
        control: 'select',
        options: [undefined, 'sm', 'md', 'lg'],
        description: 'Font size variant.',
      },
      color: {
        control: 'select',
        options: [undefined, 'default', 'muted', 'faint', 'danger', 'success', 'warning', 'info'],
        description: 'Text color variant.',
      },
      weight: {
        control: 'select',
        options: [undefined, 'normal', 'medium', 'semibold', 'bold'],
        description: 'Font weight variant.',
      },
      truncate: {
        control: 'boolean',
        description: 'Clamp to one line with a trailing ellipsis.',
        table: { defaultValue: { summary: 'false' } },
      },
      lines: {
        control: 'number',
        description: 'Maximum number of visible lines before clamping.',
      },
    },
  });
</script>

<Story name="Default">The quick brown fox jumps over the lazy dog.</Story>

<Story name="Muted" args={{ color: 'muted' }}>Helper text appears beneath a form field.</Story>

<Story name="Faint" args={{ color: 'faint' }}>Fine print, terms, or secondary captions.</Story>

<Story name="Danger" args={{ color: 'danger' }}>Something went wrong. Please try again.</Story>

<Story name="Success" args={{ color: 'success' }}>Your changes have been saved.</Story>

<Story name="Warning" args={{ color: 'warning' }}>This action cannot be undone.</Story>

<Story name="Info" args={{ color: 'info' }}>Your session will expire in 5 minutes.</Story>

<Story name="Small" args={{ size: 'sm' }}>Small body text — tooltips, labels, fine print.</Story>

<Story name="Medium" args={{ size: 'md' }}>Medium body text — the default reading size.</Story>

<Story name="Large" args={{ size: 'lg' }}>Large body text — intros, lead paragraphs.</Story>

<Story name="Semibold" args={{ weight: 'semibold' }}>
  Semibold weight for emphasis without a heading.
</Story>

<Story name="Bold" args={{ weight: 'bold' }}>Bold weight for strong emphasis.</Story>

<Story name="Truncated" args={{ truncate: true }}>
  This sentence is far too long to fit on a single line and will be cut off with a trailing ellipsis
  when the truncate prop is set.
</Story>

<Story name="Line clamped" args={{ lines: 2 }}>
  This paragraph has a lot of content. It will be clamped to two lines no matter how much text is
  placed inside it. Everything beyond the second line disappears behind an ellipsis so the layout
  stays predictable.
</Story>

<Story
  name="Renders as p by default"
  tags={['!autodocs']}
  args={{ 'data-testid': 'text-default-el' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('text-default-el');
    expect(el.tagName).toBe('P');
  }}
>
  Default element
</Story>

<Story
  name="Renders as span when as=span"
  tags={['!autodocs']}
  args={{ as: 'span', 'data-testid': 'text-span-el' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('text-span-el');
    expect(el.tagName).toBe('SPAN');
  }}
>
  Span element
</Story>

<Story
  name="Size data attribute is set"
  tags={['!autodocs']}
  args={{ size: 'sm', 'data-testid': 'text-size' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('text-size');
    expect(el).toHaveAttribute('data-size', 'sm');
  }}
>
  Small text
</Story>

<Story
  name="Color data attribute is set"
  tags={['!autodocs']}
  args={{ color: 'muted', 'data-testid': 'text-color' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('text-color');
    expect(el).toHaveAttribute('data-color', 'muted');
  }}
>
  Muted text
</Story>

<Story
  name="Truncate attribute is set"
  tags={['!autodocs']}
  args={{ truncate: true, 'data-testid': 'text-truncate' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('text-truncate');
    expect(el).toHaveAttribute('data-truncate');
  }}
>
  Truncated text
</Story>

<Story
  name="Content is rendered"
  tags={['!autodocs']}
  args={{ 'data-testid': 'text-content' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('text-content');
    expect(el).toHaveTextContent('Hello, world!');
  }}
>
  Hello, world!
</Story>

<Story
  name="Aria attributes are forwarded"
  tags={['!autodocs']}
  args={{
    'data-testid': 'text-aria',
    'aria-label': 'Error message',
    'aria-describedby': 'hint-id',
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('text-aria');
    expect(el).toHaveAttribute('aria-label', 'Error message');
    expect(el).toHaveAttribute('aria-describedby', 'hint-id');
  }}
>
  Accessible text
</Story>
