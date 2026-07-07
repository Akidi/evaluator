<!--
  @component Imposter

  Absolutely (or fixedly) positions an element centred over its nearest
  positioned ancestor. Use for overlays, modals, tooltips, and toasts.

  **The parent must be positioned.**
  For `fixed={false}` (default), the nearest ancestor with `position: relative`
  (or any non-static position) is the containing block. Without one, the element
  positions relative to the document.
  For `fixed={true}`, the element is positioned relative to the viewport — no
  positioned ancestor needed.

  **Overflow:** If the content is taller or wider than the container minus `margin`,
  the Imposter scrolls internally rather than overflowing.

  @prop fixed  - Use `position: fixed` (viewport) instead of `position: absolute` (container). Default: `false`
  @prop margin - Minimum space between the overlay and its container edges. Default: `"2rem"`
  @prop tag    - Rendered HTML element. Default: `"div"`

  @example Minimal — centred over a positioned parent
  <div style="position: relative; height: 200px;">
    <Imposter>
      <p>Centred overlay</p>
    </Imposter>
  </div>

  @example fixed — viewport-relative overlay (modal / toast)
  <Imposter fixed>
    <dialog>Modal content</dialog>
  </Imposter>

  @example margin — keep overlay away from container edges
  <div style="position: relative; height: 200px;">
    <Imposter margin="1rem">
      <p>Overlay with breathing room</p>
    </Imposter>
  </div>

  @example Typical use — confirmation dialog
  <Imposter fixed margin="1rem" tag="aside">
    <p>Are you sure?</p>
    <button>Confirm</button>
  </Imposter>

  @example All props
  <Imposter fixed margin="2rem" tag="aside">
    <p>Full overlay</p>
  </Imposter>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type ImposterTag = 'div' | 'section' | 'aside';

  interface Props {
    fixed?: boolean;
    margin?: string;
    tag?: ImposterTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let {
    fixed = false,
    margin = '2rem',
    tag = 'div',
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived([`--imposter-margin: ${margin}`, style].filter(Boolean).join('; '));
</script>

<svelte:element
  this={tag}
  data-layout="imposter"
  data-fixed={fixed ? '' : undefined}
  tabindex={0}
  style={mergedStyle}
  {...rest}
>
  {@render children()}
</svelte:element>

<style>
  :global([data-layout='imposter']) {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    transform: translate(-50%, -50%);
    max-inline-size: calc(100% - var(--imposter-margin, 0px) * 2);
    max-block-size: calc(100% - var(--imposter-margin, 0px) * 2);
    overflow: auto;
  }

  :global([data-layout='imposter'][data-fixed]) {
    position: fixed;
  }
</style>
