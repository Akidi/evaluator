<!--
  @component Tooltip

  Accessible tooltip shown on hover and focus. Wraps any trigger element and
  anchors itself to that trigger, so any number of tooltips can coexist on a
  page without manual positioning.

  Pops up in a cardinal direction (N/S/E/W) and flips to the opposite side when
  it would overflow the viewport edge.

  @prop content   - Snippet for arbitrary tooltip content.
  @prop placement - Preferred direction: 'N' | 'S' | 'E' | 'W'. Default 'N'.
  @prop children  - The trigger element(s) to wrap.

  @example
  <Tooltip placement="E">
    {#snippet content()}
      <strong>Strength</strong><br />Raises melee damage.
    {/snippet}
    <button>STR</button>
  </Tooltip>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Placement = 'N' | 'S' | 'E' | 'W';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    content: Snippet;
    placement?: Placement;
    children: Snippet;
  }

  let { content, placement = 'N', children, ...rest }: Props = $props();

  const id = `tooltip-${Math.random().toString(36).slice(2, 8)}`;
  const opposite: Record<Placement, Placement> = { N: 'S', S: 'N', E: 'W', W: 'E' };

  // `undefined` means "use the preferred `placement`"; set only when flipped.
  let resolved = $state<Placement>();
  let contentEl: HTMLElement | undefined;

  function captureContent(node: HTMLElement) {
    contentEl = node;
    return () => {
      contentEl = undefined;
    };
  }

  function reposition() {
    if (!contentEl) return;
    // Reset to the preferred side, then measure once the DOM reflects it.
    resolved = placement;
    requestAnimationFrame(() => {
      if (!contentEl) return;
      const r = contentEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const overflows =
        (placement === 'N' && r.top < 0) ||
        (placement === 'S' && r.bottom > vh) ||
        (placement === 'W' && r.left < 0) ||
        (placement === 'E' && r.right > vw);
      if (overflows) resolved = opposite[placement];
    });
  }
</script>

<span data-component="tooltip" onmouseenter={reposition} onfocusin={reposition} {...rest}>
  <span data-tooltip-trigger aria-describedby={id}>
    {@render children()}
  </span>
  <span
    {@attach captureContent}
    {id}
    role="tooltip"
    data-tooltip-content
    data-placement={resolved ?? placement}
  >
    {@render content()}
  </span>
</span>

<style>
  [data-component='tooltip'] {
    position: relative;
    display: inline-flex;
  }

  [data-tooltip-content] {
    position: absolute;
    width: max-content;
    max-width: var(--tooltip-max-width, 16rem);
    white-space: var(--tooltip-white-space, normal);
    padding: var(--tooltip-padding, 0.25rem 0.5rem);
    border-radius: var(--tooltip-radius, var(--radius-s, 0.25rem));
    background: var(--tooltip-bg, var(--text));
    color: var(--tooltip-color, var(--surface));
    font-size: var(--tooltip-font-size, 0.75rem);
    line-height: 1.4;
    pointer-events: none;
    opacity: 0;
    scale: 0.96;
    transition:
      opacity var(--tooltip-duration, 0.14s) ease,
      scale var(--tooltip-duration, 0.14s) ease;
    z-index: 50;
  }

  /* Arrow pointing back at the trigger */
  [data-tooltip-content]::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: var(--tooltip-arrow-size, 0.3rem) solid transparent;
  }

  /* Cardinal placements — `translate` handles centering so `scale` is free
	   to animate the entrance, growing out of the trigger edge. */
  [data-tooltip-content][data-placement='N'] {
    bottom: calc(100% + var(--tooltip-gap, 0.375rem));
    left: 50%;
    translate: -50% 0;
    transform-origin: bottom center;
  }

  [data-tooltip-content][data-placement='N']::after {
    top: 100%;
    left: 50%;
    translate: -50% 0;
    border-top-color: var(--tooltip-bg, var(--text));
  }

  [data-tooltip-content][data-placement='S'] {
    top: calc(100% + var(--tooltip-gap, 0.375rem));
    left: 50%;
    translate: -50% 0;
    transform-origin: top center;
  }

  [data-tooltip-content][data-placement='S']::after {
    bottom: 100%;
    left: 50%;
    translate: -50% 0;
    border-bottom-color: var(--tooltip-bg, var(--text));
  }

  [data-tooltip-content][data-placement='E'] {
    left: calc(100% + var(--tooltip-gap, 0.375rem));
    top: 50%;
    translate: 0 -50%;
    transform-origin: center left;
  }

  [data-tooltip-content][data-placement='E']::after {
    right: 100%;
    top: 50%;
    translate: 0 -50%;
    border-right-color: var(--tooltip-bg, var(--text));
  }

  [data-tooltip-content][data-placement='W'] {
    right: calc(100% + var(--tooltip-gap, 0.375rem));
    top: 50%;
    translate: 0 -50%;
    transform-origin: center right;
  }

  [data-tooltip-content][data-placement='W']::after {
    left: 100%;
    top: 50%;
    translate: 0 -50%;
    border-left-color: var(--tooltip-bg, var(--text));
  }

  [data-component='tooltip']:hover [data-tooltip-content],
  [data-tooltip-trigger]:focus-within [data-tooltip-content] {
    opacity: 1;
    scale: 1;
    transition-delay: var(--tooltip-delay, 0.35s);
  }

  @media (prefers-reduced-motion: reduce) {
    [data-tooltip-content] {
      scale: 1;
      transition: none;
    }
  }
</style>
