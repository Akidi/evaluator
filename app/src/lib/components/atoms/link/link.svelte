<!--
  @component Link

  Anchor element with variant support. All extra attributes are forwarded to the
  underlying <a>.

  When `target="_blank"` is set, `rel` defaults to `"noopener noreferrer"` for
  security. Pass an explicit `rel` to override.

  @prop href      - Destination URL. Required.
  @prop variant   - Visual style. One of `'default' | 'subtle' | 'danger'`. Default: `undefined`
  @prop children  - Link content. Required.

  @example Internal link
  <Link href="/about">About</Link>

  @example External link (rel auto-applied)
  <Link href="https://example.com" target="_blank">Visit site</Link>

  @example Danger variant
  <Link href="/delete" variant="danger">Delete account</Link>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  interface Props extends HTMLAnchorAttributes {
    href?: string;
    target?: '_self' | '_blank' | '_parent' | '_top' | '_unfencedTop';
    variant?: 'default' | 'subtle' | 'danger';
    children: Snippet;
  }

  let { href, target, variant, children, ...rest }: Props = $props();

  let rel = $derived(target == '_blank' ? 'noopener noreferrer' : '');
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
  {href}
  data-component="link"
  data-variant={variant}
  referrerpolicy="no-referrer"
  {target}
  {rel}
  {...rest}
>
  {@render children()}
</a>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

<style>
  [data-component='link'] {
    color: var(--link-color, var(--primary-text));
    text-decoration: underline;
    text-underline-offset: 0.15em;
    text-decoration-thickness: 1px;
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--ease-default);
  }

  [data-component='link']:hover {
    color: var(--link-hover-color, var(--primary-hover));
  }

  [data-component='link']:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring);
    outline-offset: var(--focus-ring-offset);
  }

  [data-component='link'][data-variant='subtle'] {
    color: var(--text-muted);
    text-decoration: none;
  }

  [data-component='link'][data-variant='subtle']:hover {
    color: var(--text);
    text-decoration: underline;
  }

  [data-component='link'][data-variant='danger'] {
    color: var(--error-text);
  }

  [data-component='link'][data-variant='danger']:hover {
    color: var(--error-hover);
  }
</style>
