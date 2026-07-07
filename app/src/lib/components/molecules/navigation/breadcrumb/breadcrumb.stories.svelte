<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Breadcrumb from './breadcrumb.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Navigation/Breadcrumb',
    component: Breadcrumb,
    tags: ['autodocs'],
    args: {
      items: [
        { label: 'Home', href: '/' },
        { label: 'Recipes', href: '/recipes' },
        { label: 'Pasta', current: true },
      ],
    },
  });
</script>

<Story name="Default" />

<Story
  name="Two levels"
  args={{
    items: [
      { label: 'Home', href: '/' },
      { label: 'Recipes', current: true },
    ],
  }}
/>

<Story name="Single item" args={{ items: [{ label: 'Home', current: true }] }} />

<Story
  name="Renders nav landmark"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy();
  }}
/>

<Story
  name="Current page has aria-current=page"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    const current = canvasElement.querySelector('[aria-current="page"]');
    expect(current).toBeTruthy();
    expect(current?.textContent?.trim()).toBe('Pasta');
  }}
/>

<Story
  name="Non-current items render as links"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Recipes' });
    expect(link).toHaveAttribute('href', '/recipes');
  }}
/>

<Story
  name="Separators between items are decorative"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    const separators = canvasElement.querySelectorAll('[data-breadcrumb-separator]');
    expect(separators.length).toBe(2);
    separators.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'));
  }}
/>
