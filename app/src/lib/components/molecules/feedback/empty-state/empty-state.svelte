<!--
  @component EmptyState

  Centred placeholder for zero-result or first-run views. Optional icon, action
  button, and description.

  @prop title       - Primary message. Required.
  @prop description - Supporting text beneath the title. Default: `undefined`
  @prop icon        - Emoji or character used as a decorative icon. Default: `undefined`
  @prop actionLabel - Button label. Requires `onaction` to render. Default: `undefined`
  @prop onaction    - Called when the action button is clicked. Default: `undefined`

  @example Minimal
  <EmptyState title="No orders yet" />

  @example With action
  <EmptyState title="No items" description="Add your first item to get started." icon="🛒" actionLabel="Add item" onaction={handleAdd} />
-->
<script lang="ts">
  import { Button } from '$lib/components/atoms';
  import { Center, Stack } from '$lib/components/layouts';

  interface Props {
    title: string;
    description?: string;
    icon?: string;
    actionLabel?: string;
    onaction?: () => void;
  }

  let { title, description, icon, actionLabel, onaction }: Props = $props();
</script>

<div data-component="empty-state">
  <Center>
    <Stack space="var(--space-4)" style="text-align: center; align-items: center;">
      {#if icon}<span data-empty-state-icon aria-hidden="true">{icon}</span>{/if}
      <Stack space="var(--space-2)">
        <strong data-empty-state-title>{title}</strong>
        {#if description}<p data-empty-state-description>{description}</p>{/if}
      </Stack>
      {#if actionLabel && onaction}
        <Button onclick={onaction}>{actionLabel}</Button>
      {/if}
    </Stack>
  </Center>
</div>
