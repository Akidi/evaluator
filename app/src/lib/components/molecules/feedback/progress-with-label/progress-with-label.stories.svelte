<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import ProgressWithLabel from './progress-with-label.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Feedback/ProgressWithLabel',
    component: ProgressWithLabel,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" args={{ label: 'Uploading files', value: 40, max: 100 }} />

<Story name="Indeterminate" args={{ label: 'Loading…' }} />

<Story name="Early stage" args={{ label: 'Processing records', value: 1, max: 10 }} />

<Story name="Nearly complete" args={{ label: 'Finalising', value: 9, max: 10 }} />

<Story name="Complete" args={{ label: 'Upload complete', value: 100, max: 100 }} />

<!-- Tests -->
<Story
  name="Renders custom value text instead of percentage"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Importing', value: 3, max: 10, valueText: 'Step 3 of 10' }}
  play={async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-component="progress-with-label"]');
    expect(card?.textContent).toContain('Step 3 of 10');
    expect(card?.textContent).not.toContain('%');
  }}
/>

<Story
  name="Rounds percentage to nearest integer"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Processing', value: 1, max: 3 }}
  play={async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-component="progress-with-label"]');
    expect(card?.textContent).toContain('33%');
    expect(card?.textContent).not.toContain('33.');
  }}
/>

<Story
  name="Defaults max to 100"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Loading', value: 40 }}
  play={async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('[data-component="progress"]');
    const card = canvasElement.querySelector('[data-component="progress-with-label"]');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(card?.textContent).toContain('40%');
  }}
/>

<Story
  name="Hides percentage when indeterminate"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Loading…' }}
  play={async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('[data-component="progress"]');
    const card = canvasElement.querySelector('[data-component="progress-with-label"]');

    expect(bar).toHaveAttribute('data-indeterminate');
    expect(card?.textContent).not.toContain('%');
  }}
/>

<Story
  name="Renders percentage value"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Uploading files', value: 40, max: 100 }}
  play={async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-component="progress-with-label"]');
    expect(card?.textContent).toContain('40%');
  }}
/>

<Story
  name="Forwards value and max to progress bar"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Uploading files', value: 3, max: 10 }}
  play={async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('[data-component="progress"]');
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemax', '10');
  }}
/>

<Story
  name="Renders progress bar"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Uploading files', value: 40 }}
  play={async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('[data-component="progress"]');
    expect(bar).toBeTruthy();
  }}
/>

<Story
  name="Renders label text"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Uploading files', value: 40 }}
  play={async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-component="progress-with-label"]');
    expect(card?.textContent).toContain('Uploading files');
  }}
/>

<Story
  name="Renders data-component attribute"
  tags={['!dev', '!autodocs']}
  args={{ label: 'Loading', value: 40 }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="progress-with-label"]')).toBeTruthy();
  }}
/>
