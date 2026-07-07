<!--
  @component Avatar

  Displays a user image, falling back to initials when `src` is absent or fails
  to load. All extra attributes are forwarded to the root element.

  @prop src       - Image URL. Optional — omit to show initials immediately.
  @prop alt       - Alt text for the image. Required when src is provided.
  @prop fallback  - Initials or short label shown when image is absent or errors.

  @example Image
  <Avatar src="/avatars/jane.jpg" alt="Jane Doe" />

  @example Initials fallback
  <Avatar fallback="JD" />
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    src?: string;
    alt?: string;
    fallback?: string;
  }

  let { src, alt, fallback, ...rest }: Props = $props();

  let errored = $state(false);
</script>

{#if src && !errored}
  <img {src} {alt} data-component="avatar" {...rest} onerror={() => (errored = true)} />
{:else}
  <span data-component="avatar" {...rest}>{fallback}</span>
{/if}

<style>
  [data-component='avatar'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--avatar-size, 2.5rem);
    height: var(--avatar-size, 2.5rem);
    border-radius: var(--avatar-radius, var(--radius-full));
    background: var(--avatar-bg, var(--surface-overlay));
    color: var(--avatar-color, var(--text-muted));
    font-size: var(--avatar-font-size, var(--text-sm));
    font-weight: var(--font-medium);
    line-height: 1;
    text-transform: uppercase;
    object-fit: cover;
    overflow: hidden;
    user-select: none;
  }
</style>
