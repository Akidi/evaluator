<!--
  @component Button

  Base button element. All extra attributes are forwarded to the underlying <button>.

  Disabled state is intentionally handled via `aria-disabled` rather than the
  native `disabled` attribute, keeping the element focusable and reachable by
  assistive technology.

  @prop variant          - Visual style variant. Sets data-variant on the root element — styling
															provided by [data-variant] CSS rules.
                           One of `'primary' | 'secondary' | 'accent' | 'ghost' | 'success' | 'info' | 'warning' | 'error'`.
                           Omit for a plain unstyled button. Default: `undefined`
  @prop type             - Native button type. One of `'button' | 'submit' | 'reset'`.
                           Default: `'button'` — always set explicitly inside forms.
  @prop disabled         - Suppresses click events and sets `aria-disabled="true"`. Default: `false`
  @prop loading          - Indicates an in-progress async action. Default: `false`
	@prop aria-label        - Accessible name for icon-only buttons that have no visible text.
	@prop aria-labelledby   - ID(s) of element(s) whose visible text labels this button.
														Use instead of aria-label when the label already exists in the DOM.
	@prop aria-pressed      - Marks a stateful toggle button (e.g. mute, bold, favourite).
														`true | false | 'mixed'`
	@prop aria-expanded     - Whether the controlled region (dropdown, accordion) is open.
	@prop aria-controls     - ID of the element this button controls. Pair with aria-expanded.
	@prop aria-haspopup     - Type of popup this button will open.
														One of `'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'`
	@prop aria-describedby  - ID of an element that provides a longer description (tooltip, hint, error).
  @prop children          - Button label / content. Required.
	@prop onclick     			- Called on click when not disabled or loading.
	@prop onkeydown   			- Called on keydown when not disabled or loading. All keydown events are suppressed when disabled or loading.
  @note loading           - Also sets `aria-busy="true"` on the button, signalling the async state
                           to assistive technology.

  @example Minimal
  <Button onclick={handleSave}>Save</Button>

  @example Variants
  <Button variant="primary" onclick={handleSubmit}>Submit</Button>
  <Button variant="ghost" onclick={handleCancel}>Cancel</Button>

  @example Disabled
  <Button disabled onclick={handleDelete}>Delete</Button>

  @example Icon-only (needs aria-label)
  <Button aria-label="Close dialog" onclick={handleClose}>
    <Icon name="x" />
  </Button>

  @example Toggle button
  <Button aria-pressed={isMuted} onclick={toggleMute}>
    {isMuted ? 'Unmute' : 'Mute'}
  </Button>

  @example Disclosure button (accordion / dropdown)
  <Button aria-expanded={isOpen} aria-controls="panel-id" onclick={toggle}>
    Details
  </Button>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?:
      | 'primary'
      | 'secondary'
      | 'accent'
      | 'ghost'
      | 'success'
      | 'info'
      | 'warning'
      | 'error';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    href?: string;
    children: Snippet;
  }

  let {
    variant,
    type = 'button',
    disabled,
    loading,
    href,
    onclick,
    onkeydown,
    children,
    ...rest
  }: Props = $props();

  const handleOnClick = (
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) => {
    if (disabled || loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onclick?.(event);
  };

  const handleKeydown = (
    event: KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) => {
    if (disabled || loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onkeydown?.(event);
  };
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
{#if href}
  <a
    {href}
    data-component="button"
    data-variant={variant}
    class="btn"
    {...rest as Record<string, unknown>}
  >
    {@render children()}
  </a>
  <!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
  <button
    aria-disabled={disabled ? 'true' : undefined}
    aria-busy={loading}
    data-component="button"
    data-variant={variant}
    class="btn"
    onclick={handleOnClick}
    onkeydown={handleKeydown}
    {type}
    {...rest}
  >
    {#if loading}
      Loading...
    {:else}
      {@render children()}
    {/if}
  </button>
{/if}

<style>
  /*
	  All values reference design tokens from assets/css (colors, spacing,
	  typography). To reuse this component in another project, copy this file
	  and ensure those token custom properties are defined on :root.
	*/
  .btn {
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    font-family: inherit;
    line-height: 1;
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: pointer;
    text-decoration: none;
    transition:
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default),
      border-color var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default),
      transform var(--duration-fast) var(--ease-default);
  }

  /* Solid (colored) variants sit slightly raised and lift on hover. Ghost and
     plain (no variant) buttons stay flat. */
  .btn[data-variant]:not([data-variant='ghost']) {
    box-shadow: var(--button-shadow, var(--shadow-xs));
  }
  .btn[data-variant]:not([data-variant='ghost']):hover:not(:disabled):not([aria-disabled='true']) {
    box-shadow: var(--button-shadow-hover, var(--shadow-sm));
    transform: translateY(-1px);
  }
  .btn[data-variant]:not([data-variant='ghost']):active:not(:disabled):not([aria-disabled='true']) {
    box-shadow: var(--button-shadow, var(--shadow-xs));
    transform: translateY(0);
  }

  .btn:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring);
    outline-offset: var(--focus-ring-offset);
  }

  .btn:disabled,
  .btn[aria-disabled='true'] {
    pointer-events: auto;
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Solid variants — share the same shape, differ only by color token family */
  .btn[data-variant='primary'] {
    background: var(--primary);
    color: var(--primary-fg);
    border-color: var(--primary);
  }
  .btn[data-variant='primary']:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--primary-hover);
    color: var(--primary-hover-fg);
    border-color: var(--primary-hover);
  }
  .btn[data-variant='primary']:active:not(:disabled):not([aria-disabled='true']) {
    background: var(--primary-active);
    color: var(--primary-active-fg);
    border-color: var(--primary-active);
  }

  .btn[data-variant='secondary'] {
    background: var(--secondary);
    color: var(--secondary-fg);
    border-color: var(--secondary);
  }
  .btn[data-variant='secondary']:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--secondary-hover);
    color: var(--secondary-hover-fg);
    border-color: var(--secondary-hover);
  }
  .btn[data-variant='secondary']:active:not(:disabled):not([aria-disabled='true']) {
    background: var(--secondary-active);
    color: var(--secondary-active-fg);
    border-color: var(--secondary-active);
  }

  .btn[data-variant='accent'] {
    background: var(--accent);
    color: var(--accent-fg);
    border-color: var(--accent);
  }
  .btn[data-variant='accent']:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--accent-hover);
    color: var(--accent-hover-fg);
    border-color: var(--accent-hover);
  }
  .btn[data-variant='accent']:active:not(:disabled):not([aria-disabled='true']) {
    background: var(--accent-active);
    color: var(--accent-active-fg);
    border-color: var(--accent-active);
  }

  .btn[data-variant='success'] {
    background: var(--success);
    color: var(--success-fg);
    border-color: var(--success);
  }
  .btn[data-variant='success']:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--success-hover);
    color: var(--success-hover-fg);
    border-color: var(--success-hover);
  }
  .btn[data-variant='success']:active:not(:disabled):not([aria-disabled='true']) {
    background: var(--success-active);
    color: var(--success-active-fg);
    border-color: var(--success-active);
  }

  .btn[data-variant='info'] {
    background: var(--info);
    color: var(--info-fg);
    border-color: var(--info);
  }
  .btn[data-variant='info']:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--info-hover);
    color: var(--info-hover-fg);
    border-color: var(--info-hover);
  }
  .btn[data-variant='info']:active:not(:disabled):not([aria-disabled='true']) {
    background: var(--info-active);
    color: var(--info-active-fg);
    border-color: var(--info-active);
  }

  .btn[data-variant='warning'] {
    background: var(--warning);
    color: var(--warning-fg);
    border-color: var(--warning);
  }
  .btn[data-variant='warning']:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--warning-hover);
    color: var(--warning-hover-fg);
    border-color: var(--warning-hover);
  }
  .btn[data-variant='warning']:active:not(:disabled):not([aria-disabled='true']) {
    background: var(--warning-active);
    color: var(--warning-active-fg);
    border-color: var(--warning-active);
  }

  .btn[data-variant='error'] {
    background: var(--error);
    color: var(--error-fg);
    border-color: var(--error);
  }
  .btn[data-variant='error']:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--error-hover);
    color: var(--error-hover-fg);
    border-color: var(--error-hover);
  }
  .btn[data-variant='error']:active:not(:disabled):not([aria-disabled='true']) {
    background: var(--error-active);
    color: var(--error-active-fg);
    border-color: var(--error-active);
  }

  /* Ghost — transparent fill, bordered */
  .btn[data-variant='ghost'] {
    background: transparent;
    color: var(--primary-text);
    border-color: var(--primary-border);
  }
  .btn[data-variant='ghost']:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--primary-subtle-bg);
    color: var(--primary-subtle-text);
  }
  .btn[data-variant='ghost']:active:not(:disabled):not([aria-disabled='true']) {
    background: var(--primary-muted-bg);
    color: var(--primary-muted-text);
  }
</style>
