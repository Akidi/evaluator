<!--
  @component CodeBlock

  Multi-line code display with a copy button. Optionally shows a language label
  in the header bar. Button text changes to "Copied!" for 2 seconds after copy.

  @prop code     - The code string to display and copy. Required.
  @prop language - Language tag shown in the header (e.g. `'typescript'`). Default: `undefined`
  @prop label    - Descriptive label shown in the header instead of language. Default: `undefined`

  @example Basic
  <CodeBlock code="npm install @acme/pkg" />

  @example With label
  <CodeBlock code="const x = 1;" language="typescript" label="example.ts" />
-->
<script lang="ts">
  import { Button } from '$lib/components/atoms';
  import { Cluster, Stack } from '$lib/components/layouts';

  interface Props {
    code: string;
    language?: string;
    label?: string;
  }

  let { code, language, label }: Props = $props();

  let copied = $state(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<div data-component="code-block" data-language={language}>
  <Stack space="0">
    {#if label}
      <Cluster
        justify="space-between"
        align="center"
        style="padding: var(--space-2) var(--space-3);"
      >
        <span data-code-block-label>{label}</span>
        <Button variant="ghost" onclick={copy} aria-label="Copy code"
          >{copied ? 'Copied!' : 'Copy'}</Button
        >
      </Cluster>
    {:else}
      <Cluster justify="flex-end" style="padding: var(--space-1) var(--space-2);">
        <Button variant="ghost" onclick={copy} aria-label="Copy code"
          >{copied ? 'Copied!' : 'Copy'}</Button
        >
      </Cluster>
    {/if}
    <pre data-code-block-pre><code>{code}</code></pre>
  </Stack>
</div>
