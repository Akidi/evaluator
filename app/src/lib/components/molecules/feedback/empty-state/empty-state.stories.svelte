<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn } from 'storybook/test';
  import EmptyState from './empty-state.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Feedback/EmptyState',
    component: EmptyState,
    tags: ['autodocs'],
  });
</script>

<Story
  name="Default"
  args={{ title: 'No results found', description: 'Try adjusting your search or filters.' }}
/>

<Story
  name="With action"
  args={{
    title: 'No recipes yet',
    description: 'Start by creating your first recipe.',
    actionLabel: 'Create recipe',
    onaction: fn(),
  }}
/>

<Story
  name="With icon"
  args={{ title: 'Nothing here', description: 'Add some items to get started.', icon: '📭' }}
/>

<!-- Tests -->
<Story
  name="Renders title and description"
  tags={['!dev', '!autodocs']}
  args={{ title: 'No results found', description: 'Try adjusting your filters.' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('No results found')).toBeTruthy();
    expect(canvas.getByText('Try adjusting your filters.')).toBeTruthy();
  }}
/>

<Story
  name="Shows action button when onaction provided"
  tags={['!dev', '!autodocs']}
  args={{ title: 'Empty', actionLabel: 'Create recipe', onaction: fn() }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: 'Create recipe' })).toBeTruthy();
  }}
/>

<Story
  name="Calls onaction when button clicked"
  tags={['!dev', '!autodocs']}
  args={{ title: 'Empty', actionLabel: 'Create', onaction: fn() }}
  play={async ({ canvas, args }) => {
    await canvas.getByRole('button', { name: 'Create' }).click();
    expect(args.onaction).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Renders data-component attribute"
  tags={['!dev', '!autodocs']}
  args={{ title: 'No results', description: 'Try again.' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="empty-state"]')).toBeTruthy();
  }}
/>
