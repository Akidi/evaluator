<!--
  @component Sidebar

  Places two children side-by-side: one fixed-width sidebar and one fluid content area.
  When the content area would drop below `contentMin`, the layout automatically stacks
  vertically — no media queries needed.

  **Which child is the sidebar?**
  With `side="left"` (default) the first child is the sidebar.
  With `side="right"` the last child is the sidebar.

  **How it works:**
  The content area has `flex-grow: 999` and `min-inline-size: contentMin`.
  Once the container is too narrow to honour `contentMin`, Flexbox wraps both
  children to full width, effectively stacking them.

  @prop side       - Which child is the sidebar. Default: `"left"`
  @prop sideWidth  - Explicit width for the sidebar child. Omit to let content size it naturally.
  @prop contentMin - Minimum width of the content area before the layout stacks. Default: `"50%"`
  @prop space      - Gap between sidebar and content. Default: `var(--space-4, 1rem)`
  @prop noStretch  - When true, sidebar and content heights are independent (no equal-height stretch).
  @prop tag        - Rendered HTML element. Default: `"div"`

  @example Minimal
  <Sidebar>
    <nav>Sidebar</nav>
    <main>Content</main>
  </Sidebar>

  @example contentMin — force stacking before content gets too narrow
  <Sidebar contentMin="40%">
    <nav>Sidebar</nav>
    <main>Content</main>
  </Sidebar>

  @example noStretch — sidebar height independent of content
  <Sidebar noStretch>
    <nav>Short sidebar</nav>
    <main>Tall content that won't force the sidebar to stretch</main>
  </Sidebar>

  @example Typical use — right sidebar, fixed width, semantic tags
  <Sidebar side="right" sideWidth="240px" tag="section">
    <main>Main content</main>
    <aside>Sidebar</aside>
  </Sidebar>

  @example All props
  <Sidebar side="right" sideWidth="240px" contentMin="60%" space="2rem" noStretch tag="article">
    <main>Content</main>
    <aside>Sidebar</aside>
  </Sidebar>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type SidebarTag = 'div' | 'section' | 'article' | 'main';

  interface Props {
    side?: 'left' | 'right';
    sideWidth?: string;
    contentMin?: string;
    space?: string;
    noStretch?: boolean;
    tag?: SidebarTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let {
    side = 'left',
    sideWidth = undefined,
    contentMin = '50%',
    space = 'var(--space-4, 1rem)',
    noStretch = false,
    tag = 'div',
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived(
    [
      `--sidebar-space: ${space}`,
      `--sidebar-content-min: ${contentMin}`,
      sideWidth ? `--sidebar-side-width: ${sideWidth}` : '',
      style,
    ]
      .filter(Boolean)
      .join('; '),
  );
</script>

<svelte:element
  this={tag}
  data-layout="sidebar"
  data-side={side}
  data-no-stretch={noStretch ? '' : undefined}
  style={mergedStyle}
  {...rest}
>
  {@render children()}
</svelte:element>

<style>
  :global([data-layout='sidebar']) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sidebar-space, 1rem);
  }

  :global([data-layout='sidebar'][data-no-stretch]) {
    align-items: flex-start;
  }

  :global([data-layout='sidebar'][data-side='left'] > :first-child) {
    flex-basis: var(--sidebar-side-width, auto);
    flex-grow: 1;
  }

  :global([data-layout='sidebar'][data-side='right'] > :last-child) {
    flex-basis: var(--sidebar-side-width, auto);
    flex-grow: 1;
  }

  :global([data-layout='sidebar'][data-side='left'] > :last-child) {
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: var(--sidebar-content-min, 50%);
  }

  :global([data-layout='sidebar'][data-side='right'] > :first-child) {
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: var(--sidebar-content-min, 50%);
  }
</style>
