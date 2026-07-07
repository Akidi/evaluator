<!--
  @component Card

  Composable content container with optional media, header, and footer slots.
  Use as the base for recipe cards, product cards, or any sectioned content.

  @prop media    - Image or media area (renders above header).
  @prop header   - Title/subtitle area.
  @prop footer   - Actions or metadata area (renders below content).
  @prop children - Main body content.

  @example Minimal
  <Card>Recipe content here</Card>

  @example Full
  <Card>
    {#snippet media()}<img src={recipe.image} alt={recipe.title} />{/snippet}
    {#snippet header()}<h2>{recipe.title}</h2>{/snippet}
    {#snippet footer()}<Button>View Recipe</Button>{/snippet}
    <p>{recipe.description}</p>
  </Card>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    media?: Snippet;
    header?: Snippet;
    footer?: Snippet;
    children?: Snippet;
  }

  let { media, header, footer, children, ...rest }: Props = $props();
</script>

<article data-component="card" {...rest}>
  {#if media}
    <div data-card-media>{@render media()}</div>
  {/if}
  {#if header}
    <header data-card-header>{@render header()}</header>
  {/if}
  {#if children}
    <div data-card-body>{@render children()}</div>
  {/if}
  {#if footer}
    <footer data-card-footer>{@render footer()}</footer>
  {/if}
</article>

<style>
  [data-component='card'] {
    display: flex;
    flex-direction: column;
    background: var(--card-bg, var(--surface));
    border: 1px solid var(--card-border-color, var(--border));
    border-radius: var(--card-radius, var(--radius-m, 0.5rem));
  }

  /* Clip only the media to the card's rounded corners. Clipping the whole
	   card (overflow: hidden on the article) would also clip popovers/tooltips
	   raised by body content, so the clip is scoped to the media wrapper. */
  [data-card-media] {
    overflow: hidden;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }

  :global([data-card-media] img) {
    display: block;
    width: 100%;
    height: var(--card-media-height, 12rem);
    object-fit: cover;
  }

  [data-card-header] {
    padding: var(--card-header-padding, var(--space-4, 1rem) var(--space-4, 1rem) 0);
  }

  [data-card-body] {
    padding: var(--card-body-padding, var(--space-4, 1rem));
    flex: 1;
  }

  [data-card-footer] {
    padding: var(--card-footer-padding, 0 var(--space-4, 1rem) var(--space-4, 1rem));
  }
</style>
