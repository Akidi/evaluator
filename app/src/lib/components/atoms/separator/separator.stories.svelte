<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Separator from './separator.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/Separator',
    component: Separator,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story name="Horizontal" />
<Story name="Vertical" args={{ orientation: 'vertical' }} />

<!-- Tests -->
<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="separator"]');
    expect(el).toBeTruthy();
  }}
/>

<Story
  name="Has role separator by default"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('separator');
    expect(el).toBeTruthy();
  }}
/>

<Story
  name="Decorative removes from accessibility tree"
  tags={['!autodocs']}
  args={{ decorative: true }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="separator"]');
    expect(el).toHaveAttribute('role', 'none');
  }}
/>

<Story
  name="Defaults to horizontal orientation"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="separator"]');
    expect(el).toHaveAttribute('data-orientation', 'horizontal');
  }}
/>

<Story
  name="Accepts vertical orientation"
  tags={['!autodocs']}
  args={{ orientation: 'vertical' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="separator"]');
    expect(el).toHaveAttribute('data-orientation', 'vertical');
  }}
/>
