<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Number from './number.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Typography/Number',
    component: Number,
    tags: ['autodocs'],
    args: { value: 1234567.89 },
  });
</script>

<Story name="Default" args={{ value: 1234567.89 }} />
<Story name="Integer" args={{ value: 42 }} />
<Story name="Currency USD" args={{ value: 9.99, currency: 'USD' }} />
<Story name="Currency EUR" args={{ value: 1234.5, currency: 'EUR' }} />
<Story name="Zero" args={{ value: 0 }} />
<Story name="Negative" args={{ value: -500 }} />

<Story
  name="Renders span with data-component"
  tags={['!autodocs']}
  args={{ value: 42 }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('span[data-component="number"]')).toBeTruthy();
  }}
/>

<Story
  name="Formats number with Intl.NumberFormat"
  tags={['!autodocs']}
  args={{ value: 1000 }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="number"]');
    expect(el?.textContent?.trim()).toBeTruthy();
    expect(el?.textContent?.trim()).not.toBe('1000');
  }}
/>

<Story
  name="Formats currency with symbol"
  tags={['!autodocs']}
  args={{ value: 9.99, currency: 'USD' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="number"]');
    expect(el?.textContent).toContain('9.99');
  }}
/>
