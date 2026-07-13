<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ThemeToggle from './theme-toggle.svelte';
  import { expect, userEvent } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Actions/ThemeToggle',
    component: ThemeToggle,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story name="Default" asChild>
  <ThemeToggle />
</Story>

<!-- Tests -->
<Story
  name="Renders a radiogroup with three options"
  asChild
  play={async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Color theme' });
    expect(group).toHaveAttribute('data-component', 'theme-toggle');
    expect(canvas.getAllByRole('radio')).toHaveLength(3);
  }}
>
  <ThemeToggle />
</Story>

<Story
  name="Selecting Dark sets data-theme on the document root"
  asChild
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Dark' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    // Reset so the story doesn't leak theme into siblings.
    await userEvent.click(canvas.getByRole('radio', { name: 'System' }));
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  }}
>
  <ThemeToggle />
</Story>
