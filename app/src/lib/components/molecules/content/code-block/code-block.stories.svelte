<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import CodeBlock from './code-block.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Content/CodeBlock',
    component: CodeBlock,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" args={{ code: 'const greeting = "Hello, world!";' }} />

<Story
  name="Multiline"
  args={{ code: `function add(a, b) {\n  return a + b;\n}`, language: 'js' }}
/>

<Story
  name="With label"
  args={{ code: 'pnpm install', language: 'sh', label: 'Install dependencies' }}
/>

<!-- Tests -->
<Story
  name="Renders code content"
  tags={['!dev', '!autodocs']}
  args={{ code: 'const x = 42;' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('const x = 42;')).toBeTruthy();
  }}
/>

<Story
  name="Sets data-language attribute"
  tags={['!dev', '!autodocs']}
  args={{ code: 'x = 1', language: 'python' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="code-block"]');
    expect(el).toHaveAttribute('data-language', 'python');
  }}
/>

<Story
  name="Has copy button"
  tags={['!dev', '!autodocs']}
  args={{ code: 'npm install' }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: /copy/i })).toBeTruthy();
  }}
/>

<Story
  name="Renders data-component attribute"
  tags={['!dev', '!autodocs']}
  args={{ code: 'const x = 1;' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="code-block"]')).toBeTruthy();
  }}
/>
