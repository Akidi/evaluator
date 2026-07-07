<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VisuallyHidden from './visually-hidden.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Accessibility/VisuallyHidden',
    component: VisuallyHidden,
    tags: ['autodocs'],
  });
</script>

<Story name="Default">Hidden label text</Story>

<Story
  name="Renders children in a span"
  tags={['!autodocs']}
  args={{ 'data-testid': 'vh' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('vh');
    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el).toHaveTextContent('Screen reader text');
    expect(el).toHaveAttribute('data-component', 'visually-hidden');
  }}>Screen reader text</Story
>
