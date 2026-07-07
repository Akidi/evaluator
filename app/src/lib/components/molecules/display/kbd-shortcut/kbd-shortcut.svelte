<!--
  @component KbdShortcut

  Keyboard shortcut display. Renders each key in `keys` as a `Kbd` atom with
  an optional descriptive label alongside.

  @prop keys  - Ordered list of key names (e.g. `['⌘', 'K']`). Required.
  @prop label - Optional description preceding the keys (e.g. `"Save"`). Default: `undefined`

  @example Without label
  <KbdShortcut keys={['⌘', 'K']} />

  @example With label
  <KbdShortcut label="Save" keys={['Ctrl', 'S']} />
-->
<script lang="ts">
  import { Kbd } from '$lib/components/atoms';
  import { Cluster } from '$lib/components/layouts';

  interface Props {
    keys: string[];
    label?: string;
  }

  let { keys, label }: Props = $props();
</script>

<span data-component="kbd-shortcut">
  <Cluster align="center" space="var(--space-1)">
    {#if label}<span data-kbd-shortcut-label>{label}</span>{/if}
    {#each keys as key (key)}
      <Kbd>{key}</Kbd>
    {/each}
  </Cluster>
</span>
