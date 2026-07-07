<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Spinner from './spinner.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Feedback/Spinner',
    component: Spinner,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story name="Default" />
<Story name="Small" args={{ size: 'sm' }} />
<Story name="Large" args={{ size: 'lg' }} />
<Story name="Custom label" args={{ label: 'Saving recipe…' }} />

<!-- Tests -->
<Story
  name="Has role status"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('status');
    expect(el).toBeTruthy();
  }}
/>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('status');
    expect(el).toHaveAttribute('data-component', 'spinner');
  }}
/>

<Story
  name="Has default accessible label"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('status');
    expect(el).toHaveAttribute('aria-label', 'Loading…');
  }}
/>

<Story
  name="Accepts custom label"
  tags={['!autodocs']}
  args={{ label: 'Saving recipe…' }}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('status');
    expect(el).toHaveAttribute('aria-label', 'Saving recipe…');
  }}
/>
