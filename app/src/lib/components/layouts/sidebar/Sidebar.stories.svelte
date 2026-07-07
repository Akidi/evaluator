<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Sidebar from './Sidebar.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Sidebar creates a two-column layout where one side has a fixed width and the other grows to fill the remaining space. ' +
            'The **background on the Sidebar itself** and the coloured child blocks are **visual aids only** — they are not part of the component.',
        },
      },
    },
    argTypes: {
      side: {
        control: { type: 'select' },
        options: ['left', 'right'],
      },
      sideWidth: { control: 'text' },
      contentMin: { control: 'text' },
      space: { control: 'text' },
      noStretch: { control: 'boolean' },
      tag: {
        control: { type: 'select' },
        options: ['div', 'section', 'article', 'main'],
      },
    },
  });
</script>

<Story
  name="Default (left sidebar)"
  args={{ sideWidth: '200px', style: 'background: var(--surface-sunken); padding: 0.5rem;' }}
  parameters={{
    docs: {
      description: {
        story:
          'First child is the sidebar (fixed `200px`), second child grows to fill remaining space. Stacks vertically when content area would drop below `contentMin` (default `50%`).',
      },
    },
  }}
>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px; min-height: 120px;"
  >
    Sidebar
  </div>
  <div
    style="background: var(--secondary-bg-emphasis); padding: 0.5rem; border-radius: 3px; min-height: 120px;"
  >
    Main content
  </div>
</Story>

<Story
  name="Right sidebar"
  args={{
    side: 'right',
    sideWidth: '200px',
    style: 'background: var(--surface-sunken); padding: 0.5rem;',
  }}
  parameters={{
    docs: {
      description: {
        story:
          '`side="right"` makes the last child the sidebar. The first child becomes the fluid content area.',
      },
    },
  }}
>
  <div
    style="background: var(--secondary-bg-emphasis); padding: 0.5rem; border-radius: 3px; min-height: 120px;"
  >
    Main content
  </div>
  <div
    style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px; min-height: 120px;"
  >
    Sidebar
  </div>
</Story>

<Story
  name="No stretch"
  args={{
    sideWidth: '200px',
    noStretch: true,
    style: 'background: var(--surface-sunken); padding: 0.5rem;',
  }}
  parameters={{
    docs: {
      description: {
        story:
          "`noStretch` sets `align-items: flex-start` so the sidebar and content heights are independent — the sidebar won't grow to match tall content.",
      },
    },
  }}
>
  <div style="background: var(--primary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Short sidebar
  </div>
  <div style="background: var(--secondary-bg-emphasis); padding: 0.5rem; border-radius: 3px;">
    Main content with more text so it is taller than the sidebar, demonstrating that the sidebar
    does not stretch to match.
  </div>
</Story>

<Story
  name="Interaction test"
  args={{ 'data-testid': 'sidebar-root' }}
  parameters={{
    docs: {
      description: {
        story:
          'Verifies `data-layout="sidebar"`, `data-side="left"`, and the default `--sidebar-space` and `--sidebar-content-min` CSS variables are applied.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const sidebar = canvas.getByTestId('sidebar-root');
    await expect(sidebar).toBeInTheDocument();
    await expect(sidebar).toHaveAttribute('data-layout', 'sidebar');
    await expect(sidebar).toHaveAttribute('data-side', 'left');
    await expect(sidebar).toHaveAttribute('style', expect.stringContaining('--sidebar-space:'));
    await expect(sidebar).toHaveAttribute(
      'style',
      expect.stringContaining('--sidebar-content-min: 50%'),
    );
  }}
>
  <div>Sidebar</div>
  <div>Content</div>
</Story>
