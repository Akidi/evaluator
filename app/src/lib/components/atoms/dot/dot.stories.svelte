<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Dot from './dot.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/Dot',
    component: Dot,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" />

<Story
  name="Is aria-hidden"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="dot"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  }}
/>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="dot"]')).toBeTruthy();
  }}
/>
