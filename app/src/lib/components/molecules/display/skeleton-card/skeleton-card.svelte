<!--
  @component SkeletonCard

  Loading placeholder card. Layout adapts to `layout` prop — avatar row,
  thumbnail sidebar, media stack, stat block, or plain text lines.

  @prop layout  - Skeleton arrangement. One of `'avatar' | 'thumbnail' | 'media' | 'stat'`.
                  Omit for plain stacked text lines. Default: `undefined`
  @prop spacing - Gap between the lead element and text lines (CSS value). Default: `'var(--space-2, 0.5rem)'`
  @prop lines   - Number of text skeleton lines. Default: `1`

  @example Plain lines
  <SkeletonCard lines={3} />

  @example Avatar layout
  <SkeletonCard layout="avatar" lines={2} />

  @example Media layout
  <SkeletonCard layout="media" lines={2} />
-->
<script lang="ts">
  import { Skeleton } from '$lib/components/atoms';
  import { Cluster, Sidebar, Stack } from '$lib/components/layouts';

  interface Props {
    layout?: 'avatar' | 'thumbnail' | 'media' | 'stat';
    spacing?: string;
    lines?: number;
  }

  let { layout, spacing = 'var(--space-2, 0.5rem)', lines = 1 }: Props = $props();

  const card_props = {
    'data-component': 'skeleton-card',
    role: 'status',
    'aria-label': 'Loading…',
  };

  const text_gap = 'var(--space-1, 0.25rem)';
</script>

{#snippet text_lines(count: number)}
  {#each { length: count }, i (i)}
    <Skeleton variant="text" width={i == count - 1 ? '60%' : '100%'} />
  {/each}
{/snippet}

{#if layout == 'avatar'}
  <Cluster space={spacing} {...card_props}>
    <Skeleton variant="circle" width="2.5rem" height="2.5rem" />
    <Stack space={text_gap}>
      {@render text_lines(lines)}
    </Stack>
  </Cluster>
{:else if layout == 'media'}
  <Stack {...card_props}>
    <Skeleton width="100%" height="8rem" />
    {@render text_lines(lines)}
  </Stack>
{:else if layout == 'stat'}
  <Stack space={text_gap} {...card_props}>
    <Skeleton variant="text" width="6rem" height="0.75em" />
    <Skeleton variant="text" width="4rem" height="1.75em" />
  </Stack>
{:else if layout == 'thumbnail'}
  <Sidebar sideWidth="4rem" space={spacing} {...card_props}>
    <Skeleton width="4rem" height="4rem" />
    <Stack space={text_gap}>
      {@render text_lines(lines)}
    </Stack>
  </Sidebar>
{:else}
  <Stack {...card_props}>
    {@render text_lines(lines)}
  </Stack>
{/if}

<style>
</style>
