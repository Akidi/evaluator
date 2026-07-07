<!--
  @component Label

  Accessible label element. Associates visible text with a form control via the
  `for` attribute. All extra attributes are forwarded to the underlying <label>.

  @prop for       - ID of the associated form control. Required for explicit association.
  @prop children  - Label text. Required.

  @example Basic
  <Label for="email">Email address</Label>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLLabelAttributes } from 'svelte/elements';

  interface Props extends HTMLLabelAttributes {
    children: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<label data-component="label" {...rest}>{@render children()}</label>

<style>
  [data-component='label'] {
    display: inline-block;
    font-size: var(--label-font-size, var(--text-sm));
    font-weight: var(--font-medium);
    line-height: 1.5;
    color: var(--label-color, var(--text));
  }
</style>
