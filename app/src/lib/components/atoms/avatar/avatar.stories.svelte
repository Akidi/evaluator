<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Avatar from './avatar.svelte';
  import { expect, waitFor } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/Avatar',
    component: Avatar,
    tags: ['autodocs'],
    argTypes: {
      src: {
        control: 'text',
        description: 'Image URL. Falls back to initials when absent or on load error.',
        table: { defaultValue: { summary: '' } },
      },
      alt: {
        control: 'text',
        description: 'Alt text for the image.',
        table: { defaultValue: { summary: '' } },
      },
      fallback: {
        control: 'text',
        description: 'Initials shown when src is absent or fails to load.',
        table: { defaultValue: { summary: '' } },
      },
    },
  });
</script>

<Story name="WithImage" args={{ src: 'https://placecats.com/64/64', alt: 'Jane Doe' }} />

<Story name="InitialsFallback" args={{ fallback: 'JD' }} />

<Story
  name="BrokenImageFallback"
  args={{
    src: 'https://this-does-not-exist.invalid/avatar.jpg',
    fallback: 'ER',
    alt: 'Error user',
  }}
/>

<Story
  name="Renders img when src is provided"
  tags={['!autodocs']}
  args={{
    src: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    alt: 'Jane Doe',
    'data-testid': 'avatar',
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('avatar');
    expect(el.tagName.toLowerCase()).toBe('img');
    expect(el).toHaveAttribute('alt', 'Jane Doe');
  }}
/>

<Story
  name="Shows initials when src is absent"
  tags={['!autodocs']}
  args={{ fallback: 'JD', 'data-testid': 'avatar-fallback' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('avatar-fallback');
    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el).toHaveTextContent('JD');
  }}
/>

<Story
  name="Shows initials when image fails to load"
  tags={['!autodocs']}
  args={{
    src: 'https://this-does-not-exist.invalid/avatar.jpg',
    fallback: 'ER',
    alt: 'Error user',
    'data-testid': 'avatar-error',
  }}
  play={async ({ canvas }) => {
    await waitFor(() => {
      const el = canvas.getByTestId('avatar-error');
      expect(el.tagName.toLowerCase()).toBe('span');
      expect(el).toHaveTextContent('ER');
    });
  }}
/>
