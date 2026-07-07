<!--
  @component Icon

  Sizes an inline SVG to match the surrounding text height and aligns it to the baseline.
  Treats the icon like a character — it scales with `font-size` and sits on the text baseline
  without requiring manual vertical alignment tweaks.

  **How it works:**
  The SVG is sized to `0.75em` (with `1cap` as a progressive enhancement) which matches
  uppercase letter height across most fonts. When an SVG is present the wrapper becomes
  `inline-flex / align-items: baseline` so icon and text share the same baseline.
  Gap between icon and text is controlled via the `space` prop.

  **Accessibility:**
  - Icon + visible text → add `aria-hidden="true"` to the SVG; the text is the label
  - Icon only (no text) → pass `ariaLabel`; adds `role="img"` + `aria-label` to the wrapper
  - Icon inside a named `<button>` or `<a>` → omit `ariaLabel`, add `aria-hidden="true"` to SVG

  @prop space    - Gap between icon and text. Default: `var(--space-2, 0.5em)`
  @prop ariaLabel - Accessible name for icon-only usage. Omit when visible text is present.

  @example Icon with visible text
  <Icon>
    <svg aria-hidden="true">...</svg>
    Close
  </Icon>

  @example Icon only
  <Icon ariaLabel="Close">
    <svg>...</svg>
  </Icon>

  @example All props
  <Icon space="0.75em" ariaLabel="Delete item">
    <svg>...</svg>
  </Icon>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    space?: string;
    /**
     * Icon-only use: when no visible text is provided, set `ariaLabel` to describe the icon.
     * This adds `role="img"` and `aria-label` to the wrapper so screen readers announce it.
     * When the Icon is inside a <button> or <a> with its own accessible name, omit `ariaLabel`
     * and add `aria-hidden="true"` to the SVG instead — the parent element provides the name.
     */
    ariaLabel?: string;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let {
    space = 'var(--space-2, 0.5em)',
    ariaLabel,
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived([`--icon-space: ${space}`, style].filter(Boolean).join('; '));
</script>

<span
  data-layout="icon"
  role={ariaLabel ? 'img' : undefined}
  aria-label={ariaLabel}
  style={mergedStyle}
  {...rest}
>
  {@render children()}
</span>

<style>
  :global([data-layout='icon'] svg) {
    height: 0.75em;
    height: 1cap;
    width: 0.75em;
    width: 1cap;
  }

  :global([data-layout='icon']:has(svg)) {
    display: inline-flex;
    align-items: baseline;
    gap: var(--icon-space, 0.5em);
  }
</style>
