<!--
  @component Tab

  A single tab button. Must be a direct child of `TabList` inside a `Tabs` context.
  Handles active state, keyboard navigation, and disabled state automatically.

  @prop value    - Unique identifier matching the corresponding `TabPanel`. Required.
  @prop disabled - Prevents selection when true. Default: `false`
  @prop children - Tab label content (required).

  @example
  <Tab value="steps">Steps</Tab>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';

  interface TabsContext {
    activeTab: string;
    setActiveTab: (v: string) => void;
    tabId: (v: string) => string;
    panelId: (v: string) => string;
  }

  interface Props {
    value: string;
    disabled?: boolean;
    children: Snippet;
  }

  let { value, disabled = false, children }: Props = $props();

  const ctx = getContext<TabsContext>(Symbol.for('tabs'));
  let isActive = $derived(ctx.activeTab === value);

  function handleClick() {
    if (!disabled) ctx.setActiveTab(value);
  }
</script>

<button
  role="tab"
  id={ctx.tabId(value)}
  aria-selected={isActive}
  aria-controls={ctx.panelId(value)}
  aria-disabled={disabled ? 'true' : undefined}
  tabindex={isActive ? 0 : -1}
  data-tab
  data-active={isActive ? '' : undefined}
  onclick={handleClick}
>
  {@render children()}
</button>

<style>
  [data-tab] {
    padding: var(--space-2) var(--space-3);
    border: none;
    border-block-end: 2px solid transparent;
    background: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    margin-block-end: -1px;
    transition:
      color 0.15s,
      border-color 0.15s;
  }

  [data-tab]:hover:not([aria-disabled='true']) {
    color: var(--text);
    background: color-mix(in oklch, currentColor 8%, transparent);
  }

  [data-tab][data-active] {
    color: var(--text);
    border-block-end-color: var(--primary-text);
  }

  [data-tab][aria-disabled='true'] {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
