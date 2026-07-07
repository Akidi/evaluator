<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent } from 'storybook/test';
  import TagInput from './tag-input.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Forms/TagInput',
    component: TagInput,
    tags: ['autodocs'],
    args: { label: 'Dietary tags' },
  });
</script>

<Story name="Default" />

<Story name="With tags" args={{ tags: ['Vegan', 'Gluten-free', 'Nut-free'] }} />

<Story name="With placeholder" args={{ placeholder: 'Add a dietary tag…' }} />

<!-- Tests -->

<Story
  name="Has data-component attribute"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="tag-input"]')).toBeTruthy();
  }}
/>

<Story
  name="Renders existing tags"
  tags={['!dev', '!autodocs']}
  args={{ tags: ['Gluten-free', 'Vegan'] }}
  play={async ({ canvasElement }) => {
    const tags = canvasElement.querySelectorAll('[data-component="tag"]');
    expect(tags).toHaveLength(2);
    expect(tags[0]).toHaveTextContent('Gluten-free');
    expect(tags[1]).toHaveTextContent('Vegan');
  }}
/>

<Story
  name="Typing a value and pressing Enter adds a tag"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await userEvent.type(input!, 'Dairy-free{Enter}');
    const tags = canvasElement.querySelectorAll('[data-component="tag"]');
    expect(tags).toHaveLength(1);
    expect(tags[0]).toHaveTextContent('Dairy-free');
  }}
/>

<Story
  name="ontagschange fires with updated tags after adding"
  tags={['!dev', '!autodocs']}
  args={{ ontagschange: fn() }}
  play={async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input');
    await userEvent.type(input!, 'Spicy{Enter}');
    expect(args.ontagschange).toHaveBeenCalledWith(['Spicy']);
  }}
/>

<Story
  name="Clicking remove button on a tag removes it"
  tags={['!dev', '!autodocs']}
  args={{ tags: ['Gluten-free', 'Vegan'] }}
  play={async ({ canvasElement }) => {
    const removeButtons = canvasElement.querySelectorAll('[data-component="tag"] button');
    await userEvent.click(removeButtons[0]);
    const remaining = canvasElement.querySelectorAll('[data-component="tag"]');
    expect(remaining).toHaveLength(1);
    expect(remaining[0]).toHaveTextContent('Vegan');
  }}
/>

<Story
  name="Whitespace-only input is ignored"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input')!;
    await userEvent.type(input, '   {Enter}');
    expect(canvasElement.querySelectorAll('[data-component="tag"]')).toHaveLength(0);
  }}
/>

<Story
  name="Adding a duplicate tag is ignored"
  tags={['!dev', '!autodocs']}
  args={{ tags: ['Vegan'] }}
  play={async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input')!;
    await userEvent.type(input, 'Vegan{Enter}');
    const tags = canvasElement.querySelectorAll('[data-component="tag"]');
    expect(tags).toHaveLength(1);
  }}
/>

<Story
  name="Input clears after adding a tag"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input')!;
    await userEvent.type(input, 'Nut-free{Enter}');
    expect(input).toHaveValue('');
  }}
/>

<Story
  name="Pressing Enter on empty input does not add a tag"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await userEvent.type(input!, '{Enter}');
    const tags = canvasElement.querySelectorAll('[data-component="tag"]');
    expect(tags).toHaveLength(0);
  }}
/>

<Story
  name="ontagschange fires with updated tags after removing"
  tags={['!dev', '!autodocs']}
  args={{ tags: ['Gluten-free', 'Vegan'], ontagschange: fn() }}
  play={async ({ canvasElement, args }) => {
    const removeButtons = canvasElement.querySelectorAll('[data-component="tag"] button');
    await userEvent.click(removeButtons[0]);
    expect(args.ontagschange).toHaveBeenCalledWith(['Vegan']);
  }}
/>
