<!--
  @component ProgressWithLabel

  Progress bar with an inline label and computed or custom value text.
  When `value` is provided without `valueText` the percentage is computed
  automatically as `Math.trunc((value / max) * 100)%`.

  @prop label     - Descriptive label shown above the bar. Required.
  @prop value     - Current progress value. Default: `undefined`
  @prop max       - Maximum value for percentage calculation. Default: `100`
  @prop valueText - Custom text shown instead of the computed percentage. Default: `undefined`

  @example Percentage
  <ProgressWithLabel label="Upload progress" value={60} />

  @example Custom text
  <ProgressWithLabel label="Items packed" value={3} max={10} valueText="3 of 10" />
-->
<script lang="ts">
  import Progress from '$lib/components/atoms/progress/progress.svelte';
  import Text from '$lib/components/atoms/text/text.svelte';
  import Cluster from '$lib/components/layouts/cluster/Cluster.svelte';
  import Stack from '$lib/components/layouts/stack/Stack.svelte';

  interface Props {
    label: string;
    value?: number;
    max?: number;
    valueText?: string;
  }

  let { label, value, valueText, max = 100 }: Props = $props();
</script>

<Stack data-component="progress-with-label">
  <Cluster justify="space-between">
    <Text as="span">{label}</Text>
    {#if value && !valueText}
      <Text as="span">{Math.trunc((value / max) * 100)}%</Text>
    {:else if valueText}
      <Text as="span">{valueText}</Text>
    {/if}
  </Cluster>
  <Progress {value} {max} />
</Stack>
