<!--
  @component LabeledValue

  A small uppercase caption above a value. Used for metadata pairs — recipe
  timings, nutrition figures, profile fields. Pass the value as the `value`
  prop or, for richer content, as the default snippet.

  @prop label    - Uppercase caption text. Required.
  @prop value    - Value text shown below the label. Optional if children given.
  @prop weight   - Font weight of the value. One of `'medium' | 'semibold'`. Default: `'semibold'`
  @prop children - Value content, used instead of `value` when richer markup is needed.

  @example Basic
  <LabeledValue label="Prep" value="15 min" />

  @example Rich value
  <LabeledValue label="Email">
    <a href="mailto:x@y.z">x@y.z</a>
  </LabeledValue>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Text } from '$lib/components/atoms';

  interface Props {
    label: string;
    value?: string | number;
    weight?: 'medium' | 'semibold';
    children?: Snippet;
  }

  let { label, value, weight = 'semibold', children }: Props = $props();
</script>

<div data-component="labeled-value">
  <Text as="span" color="faint" data-labeled-value-label>{label}</Text>
  {#if children}
    <Text as="span" {weight} style="display: block;">{@render children()}</Text>
  {:else}
    <Text as="span" {weight} style="display: block;">{value}</Text>
  {/if}
</div>

<style>
  :global([data-labeled-value-label]) {
    display: block;
    text-transform: uppercase;
    font-size: var(--text-xs);
    letter-spacing: 0.05em;
  }
</style>
