<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import KbdShortcut from './kbd-shortcut.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Display/KbdShortcut',
    component: KbdShortcut,
    tags: ['autodocs'],
  });
</script>

<Story name="Single key" args={{ keys: ['K'] }} />

<Story name="Modifier combo" args={{ keys: ['⌘', 'K'] }} />

<Story name="Three key combo" args={{ keys: ['⌘', 'Shift', 'P'] }} />

<Story name="With label" args={{ keys: ['⌘', 'S'], label: 'Save' }} />

<Story name="Ctrl variant" args={{ keys: ['Ctrl', 'Z'], label: 'Undo' }} />

<!-- Tests -->
<Story
  name="Renders one kbd per key"
  tags={['!dev', '!autodocs']}
  args={{ keys: ['⌘', 'Shift', 'P'] }}
  play={async ({ canvasElement }) => {
    const kbds = canvasElement.querySelectorAll('kbd');
    expect(kbds.length).toBe(3);
  }}
/>

<Story
  name="Renders label text"
  tags={['!dev', '!autodocs']}
  args={{ keys: ['⌘', 'S'], label: 'Save' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Save')).toBeTruthy();
  }}
/>

<Story
  name="Renders data-component attribute"
  tags={['!dev', '!autodocs']}
  args={{ keys: ['⌘', 'K'] }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="kbd-shortcut"]')).toBeTruthy();
  }}
/>
