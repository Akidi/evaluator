<!--
  @component Tabs

  Context provider for a tab set. Wrap `TabList` + `Tab` + `TabPanel` children.
  Supports controlled (`value`) and uncontrolled (`defaultValue`) modes.

  @prop value        - Controlled active tab value. If set, you manage state externally.
  @prop defaultValue - Initial active tab for uncontrolled mode.
  @prop onchange     - Called with the newly selected tab value on change.
  @prop children     - Must contain a `TabList` and one or more `TabPanel` elements.

  @example Uncontrolled
  <Tabs defaultValue="ingredients">
    <TabList>
      <Tab value="ingredients">Ingredients</Tab>
      <Tab value="steps">Steps</Tab>
    </TabList>
    <TabPanel value="ingredients">...</TabPanel>
    <TabPanel value="steps">...</TabPanel>
  </Tabs>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { setContext } from 'svelte';

  interface Props {
    value?: string;
    defaultValue?: string;
    onchange?: (value: string) => void;
    children: Snippet;
  }

  let { value, defaultValue, onchange, children }: Props = $props();

  const uid = Math.random().toString(36).slice(2, 9);

  let selectedTab = $state<string | undefined>(undefined);
  let internalActive = $derived.by(() => selectedTab ?? defaultValue ?? '');
  let activeTab = $derived(value !== undefined ? value : internalActive);

  function setActiveTab(v: string) {
    if (value === undefined) selectedTab = v;
    onchange?.(v);
  }

  setContext(Symbol.for('tabs'), {
    get activeTab() {
      return activeTab;
    },
    setActiveTab,
    tabId: (v: string) => `tab-${uid}-${v}`,
    panelId: (v: string) => `panel-${uid}-${v}`,
  });
</script>

<div data-component="tabs">{@render children()}</div>
