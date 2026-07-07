<!--
  @component TabPanel

  Content panel associated with a `Tab`. Only renders when its `value` matches the
  active tab in the parent `Tabs` context.

  @prop value    - Must match the `value` of the corresponding `Tab`. Required.
  @prop children - Panel content (required).

  @example
  <TabPanel value="ingredients">
    <p>Ingredient list here.</p>
  </TabPanel>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';

  interface TabsContext {
    activeTab: string;
    tabId: (v: string) => string;
    panelId: (v: string) => string;
  }

  interface Props {
    value: string;
    children: Snippet;
  }

  let { value, children }: Props = $props();

  const ctx = getContext<TabsContext>(Symbol.for('tabs'));
  let isActive = $derived(ctx.activeTab === value);
</script>

{#if isActive}
  <div
    role="tabpanel"
    id={ctx.panelId(value)}
    aria-labelledby={ctx.tabId(value)}
    data-tab-panel
    tabindex="0"
  >
    {@render children()}
  </div>
{/if}

<style>
  [data-tab-panel] {
    padding-block-start: var(--space-4);
    outline: none;
  }

  [data-tab-panel]:focus-visible {
    outline: 2px solid var(--primary-text);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
</style>
