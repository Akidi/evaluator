<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Skeleton from './skeleton.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Feedback/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story name="Rect" />
<Story name="Text" args={{ variant: 'text' }} />
<Story name="Circle" args={{ variant: 'circle', width: '2.5rem', height: '2.5rem' }} />
<Story name="Card placeholder" args={{ width: '100%', height: '8rem' }} />

<!-- Tests -->
<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="skeleton"]');
    expect(el).toBeTruthy();
  }}
/>

<Story
  name="Is hidden from assistive tech"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="skeleton"]');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  }}
/>

<Story
  name="Defaults to rect variant"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="skeleton"]');
    expect(el).toHaveAttribute('data-variant', 'rect');
  }}
/>

<Story
  name="Accepts circle variant"
  tags={['!autodocs']}
  args={{ variant: 'circle' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="skeleton"]');
    expect(el).toHaveAttribute('data-variant', 'circle');
  }}
/>
