<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent } from 'storybook/test';
  import QuantityStepper from './quantity-stepper.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Forms/QuantityStepper',
    component: QuantityStepper,
    tags: ['autodocs'],
    args: { value: 1 },
  });
</script>

<Story name="Default" />

<Story name="With value and bounds" args={{ value: 4, min: 1, max: 12 }} />

<Story name="Disabled" args={{ value: 2, disabled: true }} />

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="quantity-stepper"]')).toBeTruthy();
  }}
/>

<Story
  name="Increment button increases value and fires onchange"
  tags={['!autodocs']}
  args={{ value: 1, onchange: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /increase/i }));
    expect(args.onchange).toHaveBeenCalledWith(2);
  }}
/>

<Story
  name="Decrement button decreases value and fires onchange"
  tags={['!autodocs']}
  args={{ value: 3, onchange: fn() }}
  play={async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /decrease/i }));
    expect(args.onchange).toHaveBeenCalledWith(2);
  }}
/>

<Story
  name="Decrement is disabled at min"
  tags={['!autodocs']}
  args={{ value: 1, min: 1 }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: /decrease/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  }}
/>

<Story
  name="Increment is disabled at max"
  tags={['!autodocs']}
  args={{ value: 10, max: 10 }}
  play={async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: /increase/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  }}
/>

<Story
  name="Typing a value fires onchange"
  tags={['!autodocs']}
  args={{ value: 1, onchange: fn() }}
  play={async ({ canvas, args }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '5');
    expect(args.onchange).toHaveBeenCalledWith(5);
  }}
/>

<Story
  name="Typing above max clamps to max"
  tags={['!autodocs']}
  args={{ value: 1, max: 10, onchange: fn() }}
  play={async ({ canvas, args }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '99');
    expect(args.onchange).toHaveBeenCalledWith(10);
  }}
/>

<Story
  name="Typing below min clamps to min"
  tags={['!autodocs']}
  args={{ value: 5, min: 2, onchange: fn() }}
  play={async ({ canvas, args }) => {
    const input = canvas.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '1');
    expect(args.onchange).toHaveBeenCalledWith(2);
  }}
/>
