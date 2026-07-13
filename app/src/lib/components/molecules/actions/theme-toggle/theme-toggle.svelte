<!--
  @component ThemeToggle

  Segmented control for choosing the color theme: System (follow OS), Light, or Dark.
  Sets `data-theme` on the document root and persists the choice to `localStorage`.
  Choosing "System" removes the attribute and clears the stored value, so the page
  falls back to the OS `prefers-color-scheme`.

  Rendered as a `role="radiogroup"` of native radio inputs (visually hidden, so the
  control keeps full keyboard + screen-reader support) with icon labels.

  Pair with an inline script in `app.html` that applies the saved theme before first
  paint to avoid a flash of the wrong theme on load — it must read the same `storageKey`.

  @prop storageKey - localStorage key for the persisted choice. Default: `'theme'`
  @prop label      - Accessible group label. Default: `'Color theme'`

  @example
  <ThemeToggle />
-->
<script lang="ts">
  import { onMount } from 'svelte';

  type Theme = 'system' | 'light' | 'dark';

  interface Props {
    storageKey?: string;
    label?: string;
    [key: string]: unknown;
  }

  let { storageKey = 'theme', label = 'Color theme', ...rest }: Props = $props();

  const OPTIONS: { value: Theme; label: string }[] = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  let theme = $state<Theme>('system');

  onMount(() => {
    const saved = localStorage.getItem(storageKey);
    theme = saved === 'light' || saved === 'dark' ? saved : 'system';
  });

  function apply(next: Theme) {
    theme = next;
    const root = document.documentElement;
    if (next === 'system') {
      root.removeAttribute('data-theme');
      localStorage.removeItem(storageKey);
    } else {
      root.setAttribute('data-theme', next);
      localStorage.setItem(storageKey, next);
    }
  }
</script>

<div role="radiogroup" aria-label={label} data-component="theme-toggle" {...rest}>
  {#each OPTIONS as opt (opt.value)}
    <label data-theme-option>
      <input
        type="radio"
        name="theme-{storageKey}"
        value={opt.value}
        checked={theme === opt.value}
        onchange={() => apply(opt.value)}
      />
      {#if opt.value === 'system'}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      {:else if opt.value === 'light'}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          />
        </svg>
      {:else}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
        </svg>
      {/if}
      <span class="sr-only">{opt.label}</span>
    </label>
  {/each}
</div>

<style>
  [data-component='theme-toggle'] {
    display: inline-flex;
    gap: var(--space-1);
    padding: var(--space-1);
    background: var(--theme-toggle-bg, var(--surface));
    border: 1px solid var(--border);
    border-radius: var(--radius-full, 999px);
    box-shadow: var(--shadow-sm);
  }

  [data-theme-option] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: var(--radius-full, 999px);
    color: var(--text-muted);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-default),
      color var(--duration-fast) var(--ease-default);
  }

  /* Native radio kept for semantics/keyboard, hidden visually. */
  [data-theme-option] input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  [data-theme-option] svg {
    width: 1rem;
    height: 1rem;
  }

  [data-theme-option]:hover {
    color: var(--text);
    background: var(--surface-sunken);
  }

  [data-theme-option]:has(input:checked) {
    background: var(--primary);
    color: var(--primary-fg);
  }

  [data-theme-option]:has(input:focus-visible) {
    outline: var(--focus-ring-width) solid var(--focus-ring);
    outline-offset: var(--focus-ring-offset);
  }
</style>
