<!--
  @component InlineNotification

  Compact inline message with a status dot and optional dismiss button.
  Use for contextual feedback within a form or content area.

  @prop status      - Dot and semantic colour. One of `'default' | 'success' | 'warning' | 'error' | 'info'`.
                      Default: `'default'`
  @prop dismissible - When `true`, shows a dismiss button. Requires `ondismiss`. Default: `false`
  @prop ondismiss   - Called when the dismiss button is clicked. Default: `undefined`
  @prop children    - Notification message content. Required.

  @example Info
  <InlineNotification status="info">Your session expires in 5 minutes.</InlineNotification>

  @example Dismissible error
  <InlineNotification status="error" dismissible ondismiss={clearError}>Failed to save.</InlineNotification>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button, FeedbackDot } from '$lib/components/atoms';
  import { Cluster } from '$lib/components/layouts';

  type Status = 'default' | 'success' | 'warning' | 'error' | 'info';

  interface Props {
    status?: Status;
    dismissible?: boolean;
    ondismiss?: () => void;
    children: Snippet;
  }

  let { status = 'default', dismissible = false, ondismiss, children }: Props = $props();
</script>

<div data-component="inline-notification" data-status={status}>
  <Cluster align="center" space="var(--space-2)">
    <FeedbackDot {status} />
    <span data-inline-notification-body style="flex: 1; min-width: 0;">{@render children()}</span>
    {#if dismissible && ondismiss}
      <Button variant="ghost" onclick={ondismiss} aria-label="Dismiss">×</Button>
    {/if}
  </Cluster>
</div>
