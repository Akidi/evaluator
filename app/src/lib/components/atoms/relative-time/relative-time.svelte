<!--
  @component RelativeTime

  Human-readable relative timestamp (e.g. "3 minutes ago"). Renders a `<time>`
  element with an ISO `datetime` attribute. Uses `Intl.RelativeTimeFormat` with
  `en` locale and `numeric: 'auto'` for natural phrasing.

  @prop datetime - The date to format relative to now. Required.

  @example
  <RelativeTime datetime={new Date(Date.now() - 5 * 60 * 1000)} />
-->
<script lang="ts">
  interface Props {
    datetime: Date;
  }
  let { datetime }: Props = $props();

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  function format(date: Date): string {
    const diffMs = date.getTime() - Date.now();
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffWeeks = Math.round(diffDays / 7);

    if (Math.abs(diffSecs) < 60) return rtf.format(diffSecs, 'second');
    if (Math.abs(diffMins) < 60) return rtf.format(diffMins, 'minute');
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
    if (Math.abs(diffDays) < 7) return rtf.format(diffDays, 'day');
    return rtf.format(diffWeeks, 'week');
  }

  const label = $derived(format(datetime));
</script>

<time data-component="relative-time" datetime={datetime.toISOString()}>{label}</time>

<style>
  [data-component='relative-time'] {
    font-size: var(--relative-time-font-size, var(--text-sm));
    color: var(--relative-time-color, var(--text-muted));
    font-variant-numeric: tabular-nums;
  }
</style>
