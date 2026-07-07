<!--
  @component LogConsole
  Scrollable, timestamped log list with per-level coloring.
-->
<script lang="ts">
  type Entry = { time: string; msg: string; level: 'info' | 'error' | 'state' };
  interface Props {
    entries: Entry[];
    max?: string;
  }
  let { entries, max = '14rem' }: Props = $props();
</script>

<div data-component="log-console" style="--log-max: {max}">
  {#each entries as entry, i (i)}
    <div data-log-row data-level={entry.level}>
      <span data-log-time>{entry.time}</span>
      <span data-log-msg>{entry.msg}</span>
    </div>
  {:else}
    <span data-log-empty>No events yet.</span>
  {/each}
</div>

<style>
  [data-component='log-console'] {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    max-height: var(--log-max);
    overflow-y: auto;
    font-size: var(--text-sm);
  }
  [data-log-row] {
    display: flex;
    gap: var(--space-3);
  }
  [data-log-time] {
    color: var(--text-faint);
    font-family: monospace;
    flex-shrink: 0;
  }
  [data-log-msg] {
    color: var(--text-muted);
  }
  [data-level='error'] [data-log-msg],
  [data-log-row][data-level='error'] [data-log-msg] {
    color: var(--error-text);
  }
  [data-log-row][data-level='state'] [data-log-msg] {
    color: var(--primary-text);
  }
  [data-log-empty] {
    color: var(--text-faint);
    font-style: italic;
    font-size: var(--text-sm);
  }
</style>
