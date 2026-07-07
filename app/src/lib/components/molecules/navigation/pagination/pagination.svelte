<!--
  @component Pagination

  Page navigation control with previous/next buttons and optional numbered page buttons.
  Collapses long ranges with ellipsis in `"full"` variant.

  @prop currentPage  - The currently active page (1-based, required).
  @prop totalPages   - Total number of pages (required).
  @prop variant      - `"full"` shows numbered buttons; `"simple"` shows only prev/next. Default: `"full"`
  @prop disabled     - Disables all controls when true. Default: `false`
  @prop onPageChange - Called with the new page number on navigation.

  @example
  <Pagination
    currentPage={page}
    totalPages={20}
    onPageChange={(p) => (page = p)}
  />

  @example Simple
  <Pagination currentPage={1} totalPages={5} variant="simple" onPageChange={(p) => goto(p)} />
-->
<script lang="ts">
  import { Button } from '$lib/components/atoms';
  import { Cluster } from '$lib/components/layouts';

  interface Props {
    currentPage: number;
    totalPages: number;
    variant?: 'full' | 'simple';
    disabled?: boolean;
    onPageChange?: (page: number) => void;
  }

  let {
    currentPage,
    totalPages,
    variant = 'full',
    disabled = false,
    onPageChange,
  }: Props = $props();

  function getPageNumbers(current: number, total: number): (number | null)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | null)[] = [1];
    if (current > 3) pages.push(null);
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push(null);
    pages.push(total);
    return pages;
  }

  let pageNumbers = $derived(getPageNumbers(currentPage, totalPages));
</script>

<Cluster tag="nav" aria-label="Pagination" data-component="pagination" space="var(--space-1)">
  <Button
    variant="ghost"
    disabled={disabled || currentPage <= 1}
    onclick={() => onPageChange?.(currentPage - 1)}
    aria-label="Previous page">←</Button
  >

  {#if variant === 'full'}
    {#each pageNumbers as page, i (i)}
      {#if page === null}
        <span data-pagination-ellipsis aria-hidden="true">…</span>
      {:else}
        <Button
          variant={page === currentPage ? 'primary' : 'ghost'}
          {disabled}
          onclick={() => page !== currentPage && onPageChange?.(page as number)}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={`Page ${page}`}>{page}</Button
        >
      {/if}
    {/each}
  {/if}

  <Button
    variant="ghost"
    disabled={disabled || currentPage >= totalPages}
    onclick={() => onPageChange?.(currentPage + 1)}
    aria-label="Next page">→</Button
  >
</Cluster>

<style>
  :global([data-component='pagination']) {
    align-items: center;
  }

  [data-pagination-ellipsis] {
    padding-inline: var(--space-2);
    color: var(--text-muted);
    font-size: var(--text-sm);
  }
</style>
