<!--
  @component Center

  Horizontally centres its content up to a maximum width using `margin-inline: auto`.
  By default centres the block itself; with `intrinsic` it centres the children
  inside the block instead (useful for buttons and inline elements).

  @prop max       - Maximum inline size of the centred column. Default: `var(--measure, 60ch)`
  @prop gutters   - Minimum padding on each side when the container is narrow. Default: `"0px"`
  @prop intrinsic - Centre children intrinsically (flex column + align-items: center). Default: `false`
  @prop tag       - Rendered HTML element. Default: `"div"`

  @example Minimal
  <Center>
    <p>Centred column content</p>
  </Center>

  @example gutters — always keep side breathing room on narrow screens
  <Center gutters="var(--space-4, 1rem)">
    <p>Never touches the viewport edge</p>
  </Center>

  @example intrinsic — centre a button without stretching it to full width
  <Center intrinsic>
    <button>Click me</button>
  </Center>

  @example Typical use — page content column
  <Center max="75ch" gutters="1rem" tag="main">
    <h1>Page title</h1>
    <p>Body copy</p>
  </Center>

  @example All props
  <Center max="80ch" gutters="var(--space-6, 1.5rem)" intrinsic tag="article">
    <h1>Title</h1>
    <button>CTA</button>
  </Center>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type CenterTag = 'div' | 'section' | 'article' | 'main' | 'nav' | 'aside' | 'header' | 'footer';

  interface Props {
    max?: string;
    gutters?: string;
    intrinsic?: boolean;
    tag?: CenterTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let {
    max = 'var(--measure, 60ch)',
    gutters = '0px',
    intrinsic = false,
    tag = 'div',
    children,
    style = '',
    ...rest
  }: Props = $props();

  let mergedStyle = $derived(
    [`--center-max: ${max}`, `--center-gutters: ${gutters}`, style].filter(Boolean).join('; '),
  );
</script>

<svelte:element
  this={tag}
  data-layout="center"
  data-intrinsic={intrinsic ? '' : undefined}
  style={mergedStyle}
  {...rest}
>
  {@render children()}
</svelte:element>

<style>
  [data-layout='center'] {
    box-sizing: content-box;
    max-inline-size: var(--center-max, 60ch);
    margin-inline: auto;
    padding-inline: var(--center-gutters, 0px);
  }

  [data-layout='center'][data-intrinsic] {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
