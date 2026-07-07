<!--
  @component Select

  Native `<select>` dropdown. Pass `<option>` elements as children.
  Forwards all HTML select attributes.

  @example Basic
  <Select>
    <option value="pasta">Pasta</option>
    <option value="salad">Salad</option>
  </Select>

  @example Disabled
  <Select disabled>
    <option value="pasta">Pasta</option>
  </Select>

  @example Bound value
  <Select bind:value={meal}>
    <option value="pasta">Pasta</option>
    <option value="salad">Salad</option>
  </Select>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';

  interface Props extends HTMLSelectAttributes {
    children: Snippet;
  }

  let {
    children,
    value = $bindable(),
    name = `select-${Math.random().toString(36).slice(2, 8)}`,
    ...rest
  }: Props = $props();
</script>

<select data-component="select" {name} {...rest}>{@render children()}</select>

<style>
  [data-component='select'] {
    display: block;
    width: 100%;
    padding: var(--select-padding, var(--space-1, 0.25rem) var(--space-2, 0.5rem));
    border: 1px solid var(--select-border-color, var(--border));
    border-radius: var(--select-radius, var(--radius-s, 0.25rem));
    background: var(--select-bg, var(--surface));
    color: var(--select-color, var(--text));
    font-size: var(--select-font-size, 1rem);
    line-height: 1.5;
    cursor: pointer;
    appearance: auto;
  }

  [data-component='select']:focus {
    outline: var(--focus-ring-width) solid var(--select-focus-ring, var(--focus-ring));
    outline-offset: 2px;
  }

  [data-component='select']:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
