<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Badge from './badge.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/Badge',
    component: Badge,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story name="Default">New</Story>
<Story name="Success" args={{ variant: 'success' }}>Vegetarian</Story>
<Story name="Warning" args={{ variant: 'warning' }}>Contains nuts</Story>
<Story name="Danger" args={{ variant: 'danger' }}>Allergen</Story>
<Story name="Info" args={{ variant: 'info' }}>30 min</Story>

<!-- Tests -->
<Story
  name="Renders a span with data-component"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByText('New');
    expect(el).toHaveAttribute('data-component', 'badge');
  }}>New</Story
>

<Story
  name="Has default variant"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByText('New');
    expect(el).toHaveAttribute('data-variant', 'default');
  }}>New</Story
>

<Story
  name="Applies variant attribute"
  tags={['!autodocs']}
  args={{ variant: 'success' }}
  play={async ({ canvas }) => {
    const el = canvas.getByText('Vegetarian');
    expect(el).toHaveAttribute('data-variant', 'success');
  }}>Vegetarian</Story
>

<Story
  name="Renders children"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    expect(canvas.getByText('30 min')).toBeTruthy();
  }}>30 min</Story
>
