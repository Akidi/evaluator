<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import ColorSwatch from './color-swatch.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/ColorSwatch',
    component: ColorSwatch,
    tags: ['autodocs'],
  });
</script>

<Story name="Red" args={{ color: '#e53e3e', ariaLabel: 'Red' }} />
<Story name="Green" args={{ color: '#38a169', ariaLabel: 'Green' }} />

<Story
  name="Has aria-label"
  tags={['!autodocs']}
  args={{ color: '#38a169', ariaLabel: 'Forest green' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="color-swatch"]')).toHaveAttribute(
      'aria-label',
      'Forest green',
    );
  }}
/>

<Story
  name="Applies color as CSS custom property"
  tags={['!autodocs']}
  args={{ color: '#e53e3e', ariaLabel: 'Red' }}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="color-swatch"]') as HTMLElement;
    expect(el?.style.getPropertyValue('--swatch-color')).toBe('#e53e3e');
  }}
/>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  args={{ color: '#e53e3e', ariaLabel: 'Red' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="color-swatch"]')).toBeTruthy();
  }}
/>
