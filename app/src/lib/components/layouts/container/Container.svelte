<!--
  @component Container

  Establishes a CSS container query context (`container-type: inline-size`).
  Children and their descendants can use `@container` queries to respond to
  this element's width rather than the viewport width.

  **Named vs unnamed:**
  Without `name`, any `@container` query targeting the nearest container applies.
  With `name`, queries can target this container specifically by name,
  which is essential in nested container scenarios.

  @prop name - Container name for targeted `@container name (...)` queries. Omit for anonymous context.
  @prop tag  - Rendered HTML element. Default: `"div"`

  @example Minimal — anonymous container context
  <Container>
    <p>Children can use @container queries</p>
  </Container>

  @example name — named container for nested scenarios\
  <Container name="card">
    <p>Queryable as @container card</p>
  </Container>

  @example Typical use — card component that reflows based on its own width
  <Container name="product-card" tag="article">
    <img src="..." alt="..." />
    <h2>Product name</h2>
  </Container>

  @example All props
  <Container name="sidebar-widget" tag="aside">
    <p>Widget content</p>
  </Container>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type ContainerTag = 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer';

  interface Props {
    name?: string;
    tag?: ContainerTag;
    style?: string;
    [key: string]: unknown;
    children: Snippet;
  }

  let { name, tag = 'div', children, style = '', ...rest }: Props = $props();

  // Use container shorthand when named ("name / inline-size"), else just container-type
  let containerStyle = $derived(
    name ? `container: ${name} / inline-size` : `container-type: inline-size`,
  );
</script>

<svelte:element
  this={tag}
  data-layout="container"
  data-container-name={name}
  style="{containerStyle}; {style}"
  {...rest}
>
  {@render children()}
</svelte:element>
