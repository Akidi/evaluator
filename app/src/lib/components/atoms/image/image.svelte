<!--
  @component Image

  Responsive image with optional caption and fallback src. Renders a `<figure>`
  containing an `<img>`. Falls back to `fallback` src on load error.
  All extra attributes are forwarded to the root `<figure>`.

  @prop src         - Primary image URL. Required.
  @prop alt         - Alt text for the image. Required.
  @prop fallback    - Fallback image URL shown when `src` fails to load. Default: `undefined`
  @prop aspectRatio - CSS aspect-ratio value (e.g. `'16/9'`). Sets `--image-aspect-ratio`
                      on the figure. Default: `undefined`
  @prop caption     - Optional caption rendered as `<figcaption>`. Default: `undefined`

  @example Basic
  <Image src="/photo.jpg" alt="A golden retriever" />

  @example With aspect ratio and caption
  <Image src="/photo.jpg" alt="Croissant" aspectRatio="4/3" caption="Fresh from the oven" />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    src: string;
    alt: string;
    fallback?: string;
    aspectRatio?: string;
    caption?: string;
  }

  let { src, alt, fallback, aspectRatio, caption, ...rest }: Props = $props();

  let hasError = $state(false);
  let imgSrc = $derived(hasError && fallback ? fallback : src);

  function handleError() {
    hasError = true;
  }
</script>

<figure
  data-component="image"
  style={aspectRatio ? `--image-aspect-ratio: ${aspectRatio}` : undefined}
  {...rest}
>
  <img src={imgSrc} {alt} onerror={handleError} />
  {#if caption}
    <figcaption>{caption}</figcaption>
  {/if}
</figure>

<style>
  [data-component='image'] {
    margin: 0;
    display: block;
  }

  [data-component='image'] img {
    display: block;
    width: 100%;
    aspect-ratio: var(--image-aspect-ratio);
    object-fit: cover;
    border-radius: var(--radius-sm, 0.25rem);
  }

  [data-component='image'] figcaption {
    margin-block-start: var(--space-2, 0.5rem);
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
</style>
