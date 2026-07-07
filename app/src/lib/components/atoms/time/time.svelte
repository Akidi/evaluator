<!--
  @component Time

  Formatted date/time display. Renders a `<time>` element with an ISO `datetime`
  attribute and a locale-aware visible label. All extra attributes are forwarded
  to the underlying element.

  @prop date    - Date to display. Accepts a `Date` object or an ISO date string. Required.
  @prop format  - Display format. One of `'date' | 'time' | 'datetime' | 'relative'`.
                  Default: `'datetime'`

  @example Date only
  <Time date={new Date()} format="date" />

  @example Relative
  <Time date={new Date()} format="relative" />
-->
<script lang="ts">
  import type { HTMLTimeAttributes } from 'svelte/elements';

  type Format = 'date' | 'time' | 'datetime' | 'relative';

  interface Props extends HTMLTimeAttributes {
    date: Date | string;
    format?: Format;
  }

  let { date, format = 'datetime', ...rest }: Props = $props();

  let dateObj = $derived(date instanceof Date ? date : new Date(date));
  let datetime = $derived(dateObj.toISOString());

  let formatted = $derived.by(() => {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    if (format === 'relative') {
      const diff = (dateObj.getTime() - Date.now()) / 1000;
      const abs = Math.abs(diff);
      if (abs < 60) return rtf.format(Math.round(diff), 'second');
      if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
      if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
      return rtf.format(Math.round(diff / 86400), 'day');
    }
    const opts: Intl.DateTimeFormatOptions =
      format === 'date'
        ? { dateStyle: 'medium' }
        : format === 'time'
          ? { timeStyle: 'short' }
          : { dateStyle: 'medium', timeStyle: 'short' };
    return new Intl.DateTimeFormat(undefined, opts).format(dateObj);
  });
</script>

<time data-component="time" {datetime} {...rest}>{formatted}</time>

<style>
  /* Inherits surrounding text styling; tabular figures keep dates aligned. */
  [data-component='time'] {
    font-variant-numeric: tabular-nums;
  }
</style>
