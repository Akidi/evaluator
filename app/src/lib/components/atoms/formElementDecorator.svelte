<!--
  @component FormElementDecorator

  Storybook-only wrapper that renders a labelled field shell around any form
  atom for visual testing. Not intended for production use.

  @prop children - The form atom to decorate. Required.

  @example
  <FormElementDecorator>
    <Input />
  </FormElementDecorator>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="field">
  <label class="field">
    <span class="field__label">Decorator Label</span>
    <div class="field__control">
      {@render children()}
    </div>
  </label>
  <span id="hint-id" class="field__hint">This is a hint</span>
</div>

<style>
  .field {
    display: inline-flex;
    flex-direction: column;
    gap: var(--space-1);
    font-family: inherit;
  }

  .field__label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text);
    cursor: default;
  }

  .field__control {
    display: flex;
    align-items: center;
  }

  .field__hint {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }
</style>
