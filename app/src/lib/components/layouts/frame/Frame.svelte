<!--
  @component Frame

  Constrains its child to a fixed aspect ratio with `overflow: hidden`.
  `<img>` and `<video>` children automatically get `object-fit: cover` and
  fill the frame completely. Other children are centred via flexbox.

  **Why not just CSS `aspect-ratio` directly?**
  Frame pairs the aspect ratio with overflow clipping and centred alignment
  in one reusable unit, preventing children from distorting or overflowing.

  @prop ratio - Aspect ratio as a CSS value. Default: `"16 / 9"`
  @prop tag   - Rendered HTML element. Default: `"div"` (use `"figure"` for images)

  @example Minimal
  <Frame>
    <img src="photo.jpg" alt="..." />
  </Frame>

  @example ratio — square crop
  <Frame ratio="1 / 1">
    <img src="avatar.jpg" alt="..." />
  </Frame>

  @example Typical use — video thumbnail
  <Frame ratio="16 / 9" tag="figure">
    <img src="thumbnail.jpg" alt="Video thumbnail" />
  </Frame>

  @example All props
  <Frame ratio="4 / 3" tag="figure">
    <img src="photo.jpg" alt="..." />
  </Frame>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type FrameTag = 'div' | 'section' | 'article' | 'figure';

  interface Props {
    ratio?: string;
    tag?: FrameTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let { ratio = '16 / 9', tag = 'div', children, style = '', ...rest }: Props = $props();

  let mergedStyle = $derived([`--frame-ratio: ${ratio}`, style].filter(Boolean).join('; '));
</script>

<svelte:element this={tag} data-layout="frame" style={mergedStyle} {...rest}>
  {@render children()}
</svelte:element>

<style>
  :global([data-layout='frame']) {
    aspect-ratio: var(--frame-ratio, 16 / 9);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global([data-layout='frame'] > img),
  :global([data-layout='frame'] > video) {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }
</style>
