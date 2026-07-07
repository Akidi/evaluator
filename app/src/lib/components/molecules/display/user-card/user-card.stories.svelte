<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import UserCard from './user-card.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Display/UserCard',
    component: UserCard,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" args={{ name: 'Jane Smith', email: 'jane@example.com' }} />

<Story
  name="With avatar"
  args={{ name: 'Alex Rivera', email: 'alex@example.com', src: 'https://i.pravatar.cc/80?img=3' }}
/>

<Story name="With badge" args={{ name: 'Sam Lee', email: 'sam@example.com', badge: 'Admin' }} />

<Story
  name="With role"
  args={{ name: 'Chris Park', email: 'chris@example.com', role: 'Product Manager' }}
/>

<!-- Tests -->
<Story
  name="Renders name and email"
  tags={['!dev', '!autodocs']}
  args={{ name: 'Jane Smith', email: 'jane@example.com' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Jane Smith')).toBeTruthy();
    expect(canvas.getByText('jane@example.com')).toBeTruthy();
  }}
/>

<Story
  name="Shows badge when provided"
  tags={['!dev', '!autodocs']}
  args={{ name: 'Sam Lee', email: 'sam@example.com', badge: 'Admin' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Admin')).toBeTruthy();
  }}
/>

<Story
  name="Shows initials avatar when no src"
  tags={['!dev', '!autodocs']}
  args={{ name: 'Jane Smith', email: 'jane@example.com' }}
  play={async ({ canvasElement }) => {
    const avatar = canvasElement.querySelector('[data-component="avatar"]');
    expect(avatar?.textContent?.trim()).toBe('JS');
  }}
/>

<Story
  name="Renders data-component attribute"
  tags={['!dev', '!autodocs']}
  args={{ name: 'Jane Smith', email: 'jane@example.com' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="user-card"]')).toBeTruthy();
  }}
/>
