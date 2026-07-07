<!--
  @component Stat

  Displays a single labeled metric — a number with an optional unit or currency symbol.
  Used in recipe cards, nutrition panels, and dashboard summaries.

  @prop value    - Numeric value to display (required).
  @prop label    - Descriptive label shown below the value (required).
  @prop unit     - Unit suffix appended after the number (e.g. "g", "kcal").
  @prop currency - Currency code passed to the Number atom (e.g. "USD").

  @example Basic
  <Stat value={520} label="Calories" />

  @example With unit
  <Stat value={32} label="Protein" unit="g" />

  @example With currency
  <Stat value={12.99} label="Cost" currency="USD" />
-->
<script lang="ts">
  import { Number } from '$lib/components/atoms';

  interface Props {
    value: number;
    label: string;
    unit?: string;
    currency?: string;
  }

  let { value, label, unit, currency, ...rest }: Props = $props();
</script>

<div data-component="stat" {...rest}>
  <span data-stat-value
    ><Number {value} {currency} />{#if unit}<span data-stat-unit>{unit}</span>{/if}</span
  >
  <span data-stat-label>{label}</span>
</div>
