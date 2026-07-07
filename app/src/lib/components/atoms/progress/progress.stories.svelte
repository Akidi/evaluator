<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Progress from './progress.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Feedback/Progress',
    component: Progress,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story name="Default" args={{ value: 60 }} />
<Story name="Indeterminate" />
<Story name="Complete" args={{ value: 100 }} />
<Story name="Custom label" args={{ value: 3, max: 5, label: 'Step 3 of 5' }} />

<!-- Tests -->
<Story
  name="Has role progressbar"
  tags={['!autodocs']}
  args={{ value: 50 }}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('progressbar');
    expect(el).toBeTruthy();
  }}
/>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  args={{ value: 50 }}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('progressbar');
    expect(el).toHaveAttribute('data-component', 'progress');
  }}
/>

<Story
  name="Has correct aria-valuenow"
  tags={['!autodocs']}
  args={{ value: 42 }}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('progressbar');
    expect(el).toHaveAttribute('aria-valuenow', '42');
  }}
/>

<Story
  name="Indeterminate has no aria-valuenow"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('progressbar');
    expect(el).not.toHaveAttribute('aria-valuenow');
  }}
/>

<Story
  name="Has default accessible label"
  tags={['!autodocs']}
  args={{ value: 50 }}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('progressbar', { name: 'Progress' });
    expect(el).toBeTruthy();
  }}
/>
