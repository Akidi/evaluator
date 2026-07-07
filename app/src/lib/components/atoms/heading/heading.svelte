<!--
  @component Heading

  Semantic heading element rendered as `h1`–`h6` via `svelte:element`. Extra attributes are
  forwarded to the underlying heading element.

  @prop level     - Heading level. One of `1 | 2 | 3 | 4 | 5 | 6`. Default: `2`
  @prop size      - Visual size, independent of semantic level. Sets `data-size` — styling
                    provided by `[data-size]` CSS rules.
                    One of `'2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'`. Default: `undefined`
  @prop children  - Heading content. Required.

  @example Basic
  <Heading level={1}>Page Title</Heading>

  @example Override visual size
  <Heading level={2} size="sm">Small-looking h2</Heading>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLHeadingElement> {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
    children: Snippet;
  }

  let { level = 2, size, children, ...rest }: Props = $props();
  let as = $derived(`h${level}`);
</script>

<svelte:element this={as} data-component="heading" data-size={size} {...rest}>
  {@render children()}
</svelte:element>

<style>
  [data-component='heading'] {
    font-family: var(--heading-font, var(--font-sans));
    font-weight: var(--heading-font-weight, var(--font-bold));
    color: var(--heading-color, var(--text));
    line-height: var(--heading-leading, var(--leading-tight));
    letter-spacing: var(--heading-tracking, var(--tracking-md));
    margin: 0;
  }

  [data-size='2xl'] {
    font-size: var(--text-2xl);
  }
  [data-size='xl'] {
    font-size: var(--text-xl);
  }
  [data-size='lg'] {
    font-size: var(--text-lg);
  }
  [data-size='md'] {
    font-size: var(--text-md);
  }
  [data-size='sm'] {
    font-size: var(--text-sm);
  }
  [data-size='xs'] {
    font-size: var(--text-xs);
  }
</style>
