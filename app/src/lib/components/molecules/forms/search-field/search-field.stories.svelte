<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent } from 'storybook/test';
  import SearchField from './search-field.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Forms/SearchField',
    component: SearchField,
    tags: ['autodocs'],
    args: { label: 'Search recipes' },
  });
</script>

<Story name="Default" />

<Story name="With placeholder" args={{ placeholder: 'e.g. pasta, tacos…' }} />

<Story name="Disabled" args={{ disabled: true }} />

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="search-field"]')).toBeTruthy();
  }}
/>

<Story
  name="Submit button fires onSearch with current value"
  tags={['!autodocs']}
  args={{ onSearch: fn() }}
  play={async ({ canvas, args }) => {
    const input = canvas.getByRole('searchbox');
    await userEvent.type(input, 'pasta');
    await userEvent.click(canvas.getByRole('button', { name: /search/i }));
    expect(args.onSearch).toHaveBeenCalledWith('pasta');
  }}
/>

<Story
  name="Enter key fires onSearch"
  tags={['!autodocs']}
  args={{ onSearch: fn() }}
  play={async ({ canvas, args }) => {
    const input = canvas.getByRole('searchbox');
    await userEvent.type(input, 'tacos{Enter}');
    expect(args.onSearch).toHaveBeenCalledWith('tacos');
  }}
/>

<Story
  name="Disabled input blocks search"
  tags={['!autodocs']}
  args={{ disabled: true, onSearch: fn() }}
  play={async ({ canvas, args }) => {
    const input = canvas.getByRole('searchbox');
    expect(input).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(canvas.getByRole('button', { name: /search/i }));
    expect(args.onSearch).not.toHaveBeenCalled();
  }}
/>
