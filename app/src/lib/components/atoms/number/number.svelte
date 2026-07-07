<!--
  @component Number

  Locale-aware numeric display. Renders a `<span>` with `Intl.NumberFormat`
  formatting. Supports plain decimals and currency. All extra attributes are
  forwarded to the underlying element.

  @prop value    - Numeric value to format. Required.
  @prop currency - ISO 4217 currency code (e.g. `'USD'`). When set, formats as currency.
                   Default: `undefined`
  @prop locale   - BCP 47 locale string. Falls back to the browser default when omitted.
                   Default: `undefined`

  @example Plain number
  <Number value={1234} />

  @example Currency
  <Number value={9.99} currency="USD" />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    value: number;
    currency?: string;
    locale?: string;
  }

  let { value = $bindable(), currency, locale, ...rest }: Props = $props();

  let formatted = $derived.by(() => {
    const opts: Intl.NumberFormatOptions = currency
      ? { style: 'currency', currency, minimumFractionDigits: 2 }
      : { style: 'decimal' };
    return new Intl.NumberFormat(locale, opts).format(value);
  });
</script>

<span data-component="number" {...rest}>{formatted}</span>

<style>
  /* Inherits surrounding text styling; tabular figures keep digits aligned. */
  [data-component='number'] {
    font-variant-numeric: tabular-nums;
  }
</style>
