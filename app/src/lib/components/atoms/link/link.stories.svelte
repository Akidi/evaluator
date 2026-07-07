<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Link from './link.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Typography/Link',
    component: Link,
    tags: ['autodocs'],
    argTypes: {
      href: {
        control: 'text',
        description: 'The URL the link points to.',
        table: { defaultValue: { summary: '' } },
      },
      target: {
        control: 'select',
        options: ['_self', '_blank', '_parent', '_top'],
        description: 'Browsing context for the link.',
        table: { defaultValue: { summary: '_self' } },
      },
      rel: {
        control: 'text',
        description:
          'Relationship of the linked resource. Defaults to "noopener noreferrer" when target="_blank".',
        table: { defaultValue: { summary: '' } },
      },
      variant: {
        control: 'inline-radio',
        options: ['default', 'subtle', 'danger'],
        description: 'Visual variant. Maps to data-variant attribute.',
        table: { defaultValue: { summary: 'default' } },
      },
    },
  });
</script>

<Story name="Default" args={{ href: '#' }}>Visit page</Story>

<Story name="External" args={{ href: 'https://example.com', target: '_blank' }}>
  Open in new tab
</Story>

<Story
  name="Renders as anchor element"
  tags={['!autodocs']}
  args={{ href: '/about', 'data-testid': 'link-anchor' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('link-anchor');
    expect(el.tagName.toLowerCase()).toBe('a');
    expect(el).toHaveTextContent('About');
  }}>About</Story
>

<Story
  name="Href attribute is set"
  tags={['!autodocs']}
  args={{ href: '/contact', 'data-testid': 'link-href' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('link-href');
    expect(el).toHaveAttribute('href', '/contact');
  }}>Contact</Story
>

<Story
  name="External link gets rel noopener noreferrer"
  tags={['!autodocs']}
  args={{ variant: 'danger', 'data-testid': 'link-external', target: '_blank' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('link-external');
    expect(el).toHaveAttribute('target', '_blank');
    expect(el).toHaveAttribute('rel', 'noopener noreferrer');
  }}>External</Story
>

<Story
  name="Explicit rel overrides default"
  tags={['!autodocs']}
  args={{ 'data-testid': 'link-rel-override', rel: 'noopener' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('link-rel-override');
    expect(el).toHaveAttribute('rel', 'noopener');
  }}>External with custom rel</Story
>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  args={{ href: '#', 'data-testid': 'link-data-component' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('link-data-component');
    expect(el).toHaveAttribute('data-component', 'link');
  }}>Link</Story
>

<Story
  name="Variant sets data-variant attribute"
  tags={['!autodocs']}
  args={{ href: '#', variant: 'subtle', 'data-testid': 'link-variant' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('link-variant');
    expect(el).toHaveAttribute('data-variant', 'subtle');
  }}>Subtle</Story
>

<Story
  name="Aria attributes are applied when provided"
  tags={['!autodocs']}
  args={{
    href: '#',
    'data-testid': 'link-aria',
    'aria-label': 'Go to homepage',
    'aria-describedby': 'hint-id',
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('link-aria');
    expect(el).toHaveAttribute('aria-label', 'Go to homepage');
    expect(el).toHaveAttribute('aria-describedby', 'hint-id');
  }}>Home</Story
>
