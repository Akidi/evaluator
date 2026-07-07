<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import CopyField from './copy-field.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Forms/CopyField',
    component: CopyField,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" args={{ value: 'https://example.com/share/abc123' }} />

<Story name="With label" args={{ value: 'npm install @scope/package', label: 'Install command' }} />

<Story name="API key" args={{ value: 'sk-abc123def456ghi789', label: 'API Key' }} />

<!-- Tests -->
<Story
  name="Input displays value"
  tags={['!dev', '!autodocs']}
  args={{ value: 'https://example.com/share/abc' }}
  play={async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('https://example.com/share/abc');
  }}
/>

<Story
  name="Has copy button"
  tags={['!dev', '!autodocs']}
  args={{ value: 'some-value' }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: /copy/i })).toBeTruthy();
  }}
/>

<Story
  name="Renders label when provided"
  tags={['!dev', '!autodocs']}
  args={{ value: 'val', label: 'Install command' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Install command')).toBeTruthy();
  }}
/>

<Story
  name="Renders data-component attribute"
  tags={['!dev', '!autodocs']}
  args={{ value: 'https://example.com' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="copy-field"]')).toBeTruthy();
  }}
/>
