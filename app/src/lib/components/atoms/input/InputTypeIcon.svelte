<!--
  @component InputTypeIcon

  Decorative icon indicating the expected input type. Purely visual —
  all instances use aria-hidden="true". Hidden inputs render nothing.

  @prop type - The input type to render an icon for.
  @prop size - Icon size in pixels. Default: 16
-->
<script lang="ts">
  interface Props {
    type:
      | 'text'
      | 'email'
      | 'password'
      | 'number'
      | 'search'
      | 'tel'
      | 'url'
      | 'date'
      | 'time'
      | 'datetime-local'
      | 'month'
      | 'week'
      | 'hidden';
    size?: number;
  }

  let { type, size = 16 }: Props = $props();
</script>

{#if type !== 'hidden'}
  <div class="icon-wrapper">
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="input-type-icon"
    >
      {#if type === 'text'}
        <!-- Aa — uppercase A + lowercase a -->
        <text
          x="1"
          y="17"
          font-size="13"
          font-weight="700"
          font-family="serif"
          stroke="none"
          fill="currentColor">A</text
        >
        <text
          x="12"
          y="17"
          font-size="10"
          font-weight="400"
          font-family="serif"
          stroke="none"
          fill="currentColor">a</text
        >
      {:else if type === 'email'}
        <!-- @ symbol -->
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94" />
      {:else if type === 'password'}
        <!-- padlock -->
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      {:else if type === 'number'}
        <!-- hash -->
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
      {:else if type === 'search'}
        <!-- magnifying glass -->
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      {:else if type === 'tel'}
        <!-- phone handset -->
        <path
          d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        />
      {:else if type === 'url'}
        <!-- chain link -->
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      {:else if type === 'date'}
        <!-- calendar -->
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      {:else if type === 'time'}
        <!-- clock -->
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      {:else if type === 'datetime-local'}
        <!-- calendar + clock hands -->
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <polyline points="9 16 12 14 12 18" />
      {:else if type === 'month'}
        <!-- calendar with M -->
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <text
          x="7.5"
          y="20"
          font-size="8"
          font-weight="600"
          stroke="none"
          fill="currentColor"
          font-family="sans-serif">M</text
        >
      {:else if type === 'week'}
        <!-- calendar with week row highlighted -->
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <rect
          x="4"
          y="14"
          width="16"
          height="4"
          rx="1"
          fill="currentColor"
          stroke="none"
          opacity="0.3"
        />
      {/if}
    </svg>
  </div>
{/if}

<style>
  .icon-wrapper {
    padding-inline: var(--space-2);
  }
  .input-type-icon {
    flex-shrink: 0;
    color: var(--text-faint);
  }
</style>
