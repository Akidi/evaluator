<!--
  @component Separator

  Visual or semantic divider between sections. Renders as `<hr>`.
  Pass `decorative` to remove it from the accessibility tree.

  @prop orientation - `"horizontal"` or `"vertical"`. Default: `"horizontal"`
  @prop decorative  - When true, sets `role="none"` so assistive tech skips it. Default: `false`

  @example Horizontal (default)
  <Separator />

  @example Vertical (inside a flex row)
  <Separator orientation="vertical" />

  @example Decorative
  <Separator decorative />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLHRElement> {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  }

  let { orientation = 'horizontal', decorative = false, ...rest }: Props = $props();
</script>

<hr
  data-component="separator"
  data-orientation={orientation}
  role={decorative ? 'none' : 'separator'}
  aria-orientation={orientation === 'horizontal' ? undefined : 'vertical'}
  {...rest}
/>

<style>
  [data-component='separator'] {
    border: none;
    margin: 0;
    flex-shrink: 0;
  }

  [data-component='separator'][data-orientation='horizontal'] {
    width: 100%;
    height: 1px;
    background: var(--separator-color, var(--border));
    margin-block: var(--separator-spacing, 0);
  }

  [data-component='separator'][data-orientation='vertical'] {
    width: 1px;
    height: 100%;
    background: var(--separator-color, var(--border));
    margin-inline: var(--separator-spacing, 0);
    align-self: stretch;
  }
</style>
