<!--
  @component StatusDot

  Small circular indicator conveying user or system presence status.
  Renders as `<span role="img">` with colour driven by `data-status`.

  @prop status    - Presence state. One of `'online' | 'offline' | 'busy' | 'away'`. Required.
  @prop ariaLabel - Accessible name describing the status (e.g. `"Online"`). Required.

  @example All statuses
  <StatusDot status="online" ariaLabel="Online" />
  <StatusDot status="offline" ariaLabel="Offline" />
  <StatusDot status="busy" ariaLabel="Busy" />
  <StatusDot status="away" ariaLabel="Away" />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Status = 'online' | 'offline' | 'busy' | 'away';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    status: Status;
    ariaLabel: string;
  }

  let { status, ariaLabel, ...rest }: Props = $props();
</script>

<span data-component="status-dot" role="img" data-status={status} aria-label={ariaLabel} {...rest}
></span>

<style>
  [data-component='status-dot'] {
    display: inline-block;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  [data-component='status-dot'][data-status='online'] {
    background: var(--success-text, #22c55e);
  }
  [data-component='status-dot'][data-status='offline'] {
    background: var(--text-muted, #6b7280);
  }
  [data-component='status-dot'][data-status='busy'] {
    background: var(--error-text, #ef4444);
  }
  [data-component='status-dot'][data-status='away'] {
    background: var(--warning-text, #f59e0b);
  }
</style>
