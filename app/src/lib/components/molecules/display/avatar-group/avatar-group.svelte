<!--
  @component AvatarGroup

  Displays a stack of overlapping avatars with an overflow badge when the list
  exceeds `max`. Hovering the overflow badge shows a tooltip with remaining names.

  @prop avatars - Array of `{ src?, alt?, fallback? }` objects.
  @prop max     - Maximum number of avatars to show before collapsing. Default: `3`

  @example
  <AvatarGroup avatars={[
    { src: '/img/alice.jpg', alt: 'Alice' },
    { src: '/img/bob.jpg',   alt: 'Bob' },
    { fallback: 'C',         alt: 'Carol' },
    { fallback: 'D',         alt: 'Dave' }
  ]} max={3} />
-->
<script lang="ts">
  import { Avatar, Badge, Tooltip } from '$lib/components/atoms';
  import { Cluster } from '$lib/components/layouts';

  interface AvatarItem {
    src?: string;
    alt?: string;
    fallback?: string;
  }

  interface Props {
    avatars: AvatarItem[];
    max?: number;
  }

  let { avatars, max = 3, ...rest }: Props = $props();

  const hues = [210, 160, 280, 30, 340, 60, 190];

  let visibleAvatars = $derived(avatars.slice(0, max));
  let hiddenAvatars = $derived(avatars.slice(max));
  let overflowCount = $derived(hiddenAvatars.length);
  let overflowTip = $derived(
    hiddenAvatars
      .map((a) => a.alt ?? '')
      .filter(Boolean)
      .join(', ') || `${overflowCount} more`,
  );
</script>

<Cluster data-component="avatar-group" space="0" align="center" {...rest}>
  {#each visibleAvatars as avatar, i (avatar.alt ?? avatar.fallback)}
    <Avatar
      src={avatar.src}
      alt={avatar.alt ?? ''}
      fallback={avatar.fallback}
      style="--avatar-hue: {hues[i % hues.length]}"
    />
  {/each}
  {#if overflowCount > 0}
    <Tooltip>
      {#snippet content()}
        {overflowTip}
      {/snippet}
      <Badge data-avatar-group-overflow>+{overflowCount}</Badge>
    </Tooltip>
  {/if}
</Cluster>

<style>
  :global([data-component='avatar-group'] [data-component='avatar'] + [data-component='avatar']) {
    margin-inline-start: -0.5rem;
  }

  :global([data-component='avatar-group'] [data-component='avatar']:not([src])) {
    background: hsl(var(--avatar-hue, 210) 55% 82%);
    color: hsl(var(--avatar-hue, 210) 55% 18%);
  }

  :global([data-component='avatar-group'] [data-component='avatar']) {
    outline: 2px solid var(--surface);
    border-radius: 50%;
  }

  :global([data-component='avatar-group'] [data-component='tooltip']) {
    margin-inline-start: -0.5rem;
  }

  :global([data-avatar-group-overflow]) {
    outline: 2px solid var(--surface);
  }
</style>
