<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent } from 'storybook/test';
  import Pagination from './pagination.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Navigation/Pagination',
    component: Pagination,
    tags: ['autodocs'],
  });
</script>

<Story name="First page" args={{ currentPage: 1, totalPages: 10 }} />

<Story name="Middle page" args={{ currentPage: 5, totalPages: 10 }} />

<Story name="Last page" args={{ currentPage: 10, totalPages: 10 }} />

<Story name="Few pages (no ellipsis)" args={{ currentPage: 2, totalPages: 5 }} />

<Story name="Prev/next only variant" args={{ currentPage: 3, totalPages: 10, variant: 'simple' }} />

<Story name="Disabled" args={{ currentPage: 3, totalPages: 10, disabled: true }} />

<Story
  name="Renders nav landmark"
  tags={['!autodocs']}
  args={{ currentPage: 1, totalPages: 5 }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
  }}
/>

<Story
  name="Current page button has aria-current=page"
  tags={['!autodocs']}
  args={{ currentPage: 3, totalPages: 5 }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  }}
/>

<Story
  name="Next fires onPageChange with next page"
  tags={['!autodocs']}
  args={{ currentPage: 3, totalPages: 5, onPageChange: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /next/i }));
    expect(args.onPageChange).toHaveBeenCalledWith(4);
  }}
/>

<Story
  name="Previous fires onPageChange with previous page"
  tags={['!autodocs']}
  args={{ currentPage: 3, totalPages: 5, onPageChange: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /previous/i }));
    expect(args.onPageChange).toHaveBeenCalledWith(2);
  }}
/>

<Story
  name="Previous disabled on first page"
  tags={['!autodocs']}
  args={{ currentPage: 1, totalPages: 5 }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: /previous/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  }}
/>

<Story
  name="Next disabled on last page"
  tags={['!autodocs']}
  args={{ currentPage: 5, totalPages: 5 }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: /next/i })).toHaveAttribute('aria-disabled', 'true');
  }}
/>

<Story
  name="Clicking current page does not fire onPageChange"
  tags={['!autodocs']}
  args={{ currentPage: 3, totalPages: 5, onPageChange: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Page 3' }));
    expect(args.onPageChange).not.toHaveBeenCalled();
  }}
/>
