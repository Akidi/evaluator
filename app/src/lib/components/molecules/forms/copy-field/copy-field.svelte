<!--
  @component CopyField

  Read-only text field with a one-click copy button. Button text changes to
  "Copied!" for 2 seconds after a successful clipboard write.

  @prop value - The text value to display and copy. Required.
  @prop label - Optional label rendered above the field. Default: `undefined`

  @example Basic
  <CopyField value="https://example.com/share/abc123" />

  @example With label
  <CopyField value="sk-abc123" label="API Key" />
-->
<script lang="ts">
  import { Button, Input, Label } from '$lib/components/atoms';
  import { Cluster, Stack } from '$lib/components/layouts';

  interface Props {
    value: string;
    label?: string;
  }

  let { value, label }: Props = $props();

  let copied = $state(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<div data-component="copy-field">
  <Stack space="var(--space-1)">
    {#if label}<Label>{label}</Label>{/if}
    <Cluster space="var(--space-2)" align="center">
      <Input
        readonly
        {value}
        aria-label={label ?? 'Copyable value'}
        style="flex: 1; min-width: 0;"
      />
      <Button variant="secondary" onclick={copy} aria-label="Copy to clipboard">
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </Cluster>
  </Stack>
</div>
