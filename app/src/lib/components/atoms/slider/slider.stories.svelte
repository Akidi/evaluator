<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Slider from './slider.svelte';
  import FormElementDecorator from '../formElementDecorator.svelte';
  import { expect, fn } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Form Controls/Slider',
    component: Slider,
    tags: ['autodocs'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: [() => ({ Component: FormElementDecorator as any })],
    argTypes: {
      min: {
        control: 'number',
        description: 'Minimum value.',
        table: { defaultValue: { summary: '0' } },
      },
      max: {
        control: 'number',
        description: 'Maximum value.',
        table: { defaultValue: { summary: '100' } },
      },
      step: {
        control: 'number',
        description: 'Increment between selectable values.',
        table: { defaultValue: { summary: '1' } },
      },
      value: {
        control: 'number',
        description: 'Current value.',
      },
      disabled: {
        control: 'boolean',
        description:
          'Suppresses input/change events and sets `aria-disabled="true"`. The element stays focusable.',
        table: { defaultValue: { summary: 'false' } },
      },
      oninput: { description: 'Called continuously as the slider moves.' },
      onchange: { description: 'Called once when the value is committed (mouseup / keyboard).' },
    },
  });
</script>

<Story name="Default" />

<Story name="Custom range" args={{ min: 0, max: 10, value: 5, step: 1 }} />

<Story name="Disabled" args={{ disabled: true }} />

<Story
  name="Value is reflected"
  tags={['!autodocs']}
  args={{ 'data-testid': 'slider-value', value: 75, min: 0, max: 100 }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('slider-value') as HTMLInputElement;
    expect(el).toHaveValue('75');
  }}
/>

<Story
  name="Min, max, and step are forwarded"
  tags={['!autodocs']}
  args={{ 'data-testid': 'slider-attrs', min: 10, max: 50, step: 5, value: 20 }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('slider-attrs');
    expect(el).toHaveAttribute('min', '10');
    expect(el).toHaveAttribute('max', '50');
    expect(el).toHaveAttribute('step', '5');
  }}
/>

<Story
  name="Aria attributes are applied when provided"
  tags={['!autodocs']}
  args={{
    'data-testid': 'slider-aria',
    'aria-label': 'Volume',
    'aria-describedby': 'hint-id',
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('slider-aria');
    expect(el).toHaveAttribute('aria-label', 'Volume');
    expect(el).toHaveAttribute('aria-describedby', 'hint-id');
  }}
/>

<Story
  name="Not interactive when disabled"
  tags={['!autodocs']}
  args={{ 'data-testid': 'slider-disabled', disabled: true, oninput: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('slider-disabled');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).not.toBeDisabled();
    el.dispatchEvent(new Event('input', { bubbles: true }));
    expect(args.oninput).not.toHaveBeenCalled();
  }}
/>

<Story
  name="Fires oninput when value changes"
  tags={['!autodocs']}
  args={{ 'data-testid': 'slider-interactive', oninput: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('slider-interactive');
    expect(el).not.toHaveAttribute('aria-disabled');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    expect(args.oninput).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Doesn't fire oninput when disabled"
  tags={['!autodocs']}
  args={{ 'data-testid': 'slider-input-disabled', disabled: true, oninput: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('slider-input-disabled');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    expect(args.oninput).not.toHaveBeenCalled();
  }}
/>

<Story
  name="Fires onchange on commit"
  tags={['!autodocs']}
  args={{ 'data-testid': 'slider-onchange', onchange: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('slider-onchange');
    expect(el).not.toHaveAttribute('aria-disabled');
    el.dispatchEvent(new Event('change', { bubbles: true }));
    expect(args.onchange).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Doesn't fire onchange when disabled"
  tags={['!autodocs']}
  args={{ 'data-testid': 'slider-onchange-disabled', disabled: true, onchange: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('slider-onchange-disabled');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    el.dispatchEvent(new Event('change', { bubbles: true }));
    expect(args.onchange).not.toHaveBeenCalled();
  }}
/>
