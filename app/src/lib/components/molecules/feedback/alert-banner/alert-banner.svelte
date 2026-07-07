<!--
  @component AlertBanner

  Inline status message with an icon, optional title, optional dismiss button,
  and four semantic variants.

  @prop variant     - Visual style. One of `"success" | "warning" | "error" | "info"`. Default: `"info"`
  @prop title       - Bold heading shown above the body text.
  @prop dismissible - Shows a dismiss button when true. Default: `false`
  @prop ondismiss   - Called when the dismiss button is clicked (required).
  @prop children    - Message body content (required).

  @example Info
  <AlertBanner ondismiss={() => {}}>Your session will expire in 5 minutes.</AlertBanner>

  @example Error with title
  <AlertBanner variant="error" title="Save failed" dismissible ondismiss={() => (show = false)}>
    Check your connection and try again.
  </AlertBanner>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button } from '$lib/components/atoms';
  import { Cluster, Stack } from '$lib/components/layouts';

  type AlertVariant = 'success' | 'warning' | 'error' | 'info';

  interface Props {
    variant?: AlertVariant;
    title?: string;
    dismissible?: boolean;
    ondismiss: () => void;
    children: Snippet;
  }

  let {
    variant = 'info',
    title,
    dismissible = false,
    ondismiss,
    children,
    ...rest
  }: Props = $props();

  const iconPaths: Record<AlertVariant, string> = {
    success: 'M5 13l4 4L19 7',
    warning:
      'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
    error: 'M6 18L18 6M6 6l12 12',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };
</script>

<div data-component="alert-banner" data-variant={variant} role="alert" {...rest}>
  <Cluster align="center" space="var(--space-3)">
    <svg
      data-alert-banner-icon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d={iconPaths[variant]} />
    </svg>
    <Stack space="var(--space-1)" style="flex: 1; min-width: 0;">
      {#if title}
        <strong data-alert-banner-title>{title}</strong>
      {/if}
      <div data-alert-banner-body>{@render children()}</div>
    </Stack>
    {#if dismissible}
      <Button
        variant="ghost"
        onclick={ondismiss}
        aria-label="Dismiss alert"
        data-alert-banner-dismiss
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </Button>
    {/if}
  </Cluster>
</div>

<style>
  [data-component='alert-banner'] {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    border: 1px solid;
  }

  [data-component='alert-banner'][data-variant='success'] {
    background: var(--success-subtle-bg);
    color: var(--success-text);
    border-color: var(--success-border);
  }

  [data-component='alert-banner'][data-variant='warning'] {
    background: var(--warning-subtle-bg);
    color: var(--warning-text);
    border-color: var(--warning-border);
  }

  [data-component='alert-banner'][data-variant='error'] {
    background: var(--error-subtle-bg);
    color: var(--error-text);
    border-color: var(--error-border);
  }

  [data-component='alert-banner'][data-variant='info'] {
    background: var(--info-subtle-bg);
    color: var(--info-text);
    border-color: var(--info-border);
  }

  [data-alert-banner-icon] {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  [data-alert-banner-title] {
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
  }

  [data-alert-banner-body] {
    font-size: var(--text-sm);
  }
</style>
