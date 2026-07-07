<!--
  @component StatCard

  Single metric display with label, formatted value, optional description, and
  trend indicator. `trend` renders as "+N%" (positive) or "N%" (negative) with
  `data-trend="up"` or `data-trend="down"` for CSS colouring.

  @prop label       - Metric name (e.g. `"Total orders"`). Required.
  @prop value       - Numeric metric value. Required.
  @prop description - Supporting context shown below the value. Default: `undefined`
  @prop suffix      - Unit string appended to the value (e.g. `" kg"`). Default: `undefined`
  @prop trend       - Percentage change. Positive → "up", negative → "down". Default: `undefined`

  @example Basic
  <StatCard label="Orders" value={42} />

  @example With trend
  <StatCard label="Revenue" value={1200} suffix=" USD" trend={8} />
-->
<script lang="ts">
  import { Stack } from '$lib/components/layouts';
  import { Text } from '$lib/components/atoms';

  interface Props {
    label: string;
    value: number;
    description?: string;
    suffix?: string;
    trend?: number;
  }

  let { label, value, description, suffix, trend }: Props = $props();
</script>

<div data-component="stat-card">
  <Stack space="var(--space-1)">
    <Text as="span" data-stat-card-label>{label}</Text>
    <Text as="span" data-stat-card-value>{value}{suffix ?? ''}</Text>
    {#if description}<Text as="span" data-stat-card-description>{description}</Text>{/if}
    {#if trend !== undefined}<Text
        as="span"
        data-stat-card-trend
        data-trend={trend >= 0 ? 'up' : 'down'}>{trend > 0 ? '+' : ''}{trend}%</Text
      >{/if}
  </Stack>
</div>
