<!--
  @component TimelineItem

  Single event in a timeline. Shows a status dot, label, optional description,
  and a relative timestamp.

  @prop label       - Event title. Required.
  @prop datetime    - When the event occurred. Required.
  @prop description - Supporting detail shown below the label. Default: `undefined`
  @prop status      - Dot colour. One of `'default' | 'success' | 'warning' | 'error' | 'info'`.
                      Default: `'default'`

  @example Basic
  <TimelineItem label="Order placed" datetime={new Date()} />

  @example With status and description
  <TimelineItem label="Payment confirmed" description="Visa ending 4242" datetime={new Date()} status="success" />
-->
<script lang="ts">
  import { FeedbackDot } from '$lib/components/atoms';
  import RelativeTime from '$lib/components/atoms/relative-time/relative-time.svelte';
  import { Cluster, Stack } from '$lib/components/layouts';

  type Status = 'default' | 'success' | 'warning' | 'error' | 'info';

  interface Props {
    label: string;
    datetime: Date;
    description?: string;
    status?: Status;
  }

  let { label, datetime, description, status = 'default' }: Props = $props();
</script>

<div data-component="timeline-item" data-status={status}>
  <Cluster align="start" space="var(--space-3)">
    <FeedbackDot {status} />
    <Stack space="var(--space-1)">
      <span data-timeline-item-label>{label}</span>
      {#if description}<span data-timeline-item-description>{description}</span>{/if}
      <RelativeTime {datetime} />
    </Stack>
  </Cluster>
</div>
