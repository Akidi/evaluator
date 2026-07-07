<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import AvatarGroup from './avatar-group.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Display/AvatarGroup',
    component: AvatarGroup,
    tags: ['autodocs'],
  });

  const avatars = [
    { fallback: 'AB', alt: 'Alice Brown' },
    { fallback: 'CD', alt: 'Carol Davis' },
    { fallback: 'EF', alt: 'Eve Foster' },
    { fallback: 'GH', alt: 'Grace Hall' },
    { fallback: 'IJ', alt: 'Iris Jones' },
  ];
</script>

<Story name="Three avatars" args={{ avatars: avatars.slice(0, 3) }} />

<Story name="With overflow" args={{ avatars, max: 3 }} />

<Story name="Custom max" args={{ avatars, max: 2 }} />

<Story name="All visible" args={{ avatars, max: 10 }} />

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  args={{ avatars: avatars.slice(0, 3) }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="avatar-group"]')).toBeTruthy();
  }}
/>

<Story
  name="Shows overflow badge when avatars exceed max"
  tags={['!autodocs']}
  args={{ avatars, max: 3 }}
  play={async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('[data-component="badge"]');
    expect(badge).toBeTruthy();
    expect(badge?.textContent?.trim()).toBe('+2');
  }}
/>

<Story
  name="No overflow badge when avatars fit within max"
  tags={['!autodocs']}
  args={{ avatars: avatars.slice(0, 3), max: 5 }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="badge"]')).toBeNull();
  }}
/>

<Story
  name="Renders correct number of visible avatars"
  tags={['!autodocs']}
  args={{ avatars, max: 3 }}
  play={async ({ canvasElement }) => {
    const avatarEls = canvasElement.querySelectorAll('[data-component="avatar"]');
    expect(avatarEls.length).toBe(3);
  }}
/>
