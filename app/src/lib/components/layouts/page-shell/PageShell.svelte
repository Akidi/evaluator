<!--
  @component PageShell

  The shared page content column. Centers content up to a max inline-size and
  always keeps side gutters, so marketing, dashboard, and admin sections share
  one consistent gap instead of each hand-rolling padding. Composes `Center`.

  Full-bleed backgrounds belong on an outer wrapper (e.g. a `<section>`); put
  PageShell *inside* it to constrain just the content.

  @prop max     - Max inline-size of the column. Default: `var(--page-max, 72rem)`
  @prop gutters - Minimum side padding. Default: `var(--space-6)`
  @prop padded  - Add `padding-block: var(--space-6)`. Default: `true`
  @prop tag     - Rendered element. Default: `"div"`

  @example Typical page body
  <PageShell tag="main">
    <h1>Title</h1>
  </PageShell>

  @example Inside a full-bleed section (no extra vertical padding)
  <section class="hero">
    <PageShell padded={false}>…</PageShell>
  </section>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Center from '../center/Center.svelte';

  type ShellTag = 'div' | 'section' | 'main' | 'article';

  interface Props {
    max?: string;
    gutters?: string;
    padded?: boolean;
    tag?: ShellTag;
    style?: string;
    children: Snippet;
    [key: string]: unknown;
  }

  let {
    max = 'var(--page-max, 72rem)',
    gutters = 'var(--space-6)',
    padded = true,
    tag = 'div',
    style = '',
    children,
    ...rest
  }: Props = $props();

  let mergedStyle = $derived(
    [padded ? 'padding-block: var(--space-6)' : '', style].filter(Boolean).join('; '),
  );
</script>

<Center {tag} {max} {gutters} style={mergedStyle} {...rest}>
  {@render children()}
</Center>
