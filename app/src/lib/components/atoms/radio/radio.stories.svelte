<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Radio from './radio.svelte';
  import FormElementDecorator from '../formElementDecorator.svelte';
  import { expect, fn, userEvent } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Form Controls/Radio',
    component: Radio,
    tags: ['autodocs'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: [() => ({ Component: FormElementDecorator as any })],
    argTypes: {
      checked: {
        control: 'boolean',
        description: 'Whether this option is selected.',
        table: { defaultValue: { summary: 'false' } },
      },
      disabled: {
        control: 'boolean',
        description:
          'Suppresses click/keydown events and sets `aria-disabled="true"`. The element stays focusable.',
        table: { defaultValue: { summary: 'false' } },
      },
      name: {
        control: 'text',
        description: 'Groups radio buttons into a mutually exclusive set.',
      },
      value: {
        control: 'text',
        description: 'The value submitted with the form when this option is selected.',
      },
      onclick: { description: 'Called on click when not disabled.' },
      onkeydown: { description: 'Called on keydown when not disabled.' },
    },
  });
</script>

<Story name="Default" />

<Story name="Checked" args={{ checked: true }} />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Disabled and Checked" args={{ disabled: true, checked: true }} />

<Story
  name="Aria attributes are applied when provided"
  tags={['!autodocs']}
  args={{
    'data-testid': 'radio-aria',
    'aria-label': 'Option A',
    'aria-describedby': 'hint-id',
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('radio-aria');
    expect(el).toHaveAttribute('aria-label', 'Option A');
    expect(el).toHaveAttribute('aria-describedby', 'hint-id');
  }}
/>

<Story
  name="Not interactive when disabled"
  tags={['!autodocs']}
  args={{ 'data-testid': 'radio-disabled', disabled: true, onclick: fn(), onkeydown: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('radio-disabled');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).not.toBeDisabled();
    await userEvent.click(el);
    el.focus();
    await userEvent.keyboard('{space}');
    expect(args.onclick).not.toHaveBeenCalled();
    expect(args.onkeydown).not.toHaveBeenCalled();
  }}
/>

<Story
  name="Fires onclick when clicked"
  tags={['!autodocs']}
  args={{ 'data-testid': 'radio-interactive', onclick: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('radio-interactive');
    expect(el).not.toHaveAttribute('aria-disabled');
    await userEvent.click(el);
    expect(args.onclick).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Fires onkeydown on Space"
  tags={['!autodocs']}
  args={{ 'data-testid': 'radio-keyboard', onkeydown: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('radio-keyboard');
    el.focus();
    await userEvent.keyboard('{space}');
    expect(args.onkeydown).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Does not fire onkeydown when disabled"
  tags={['!autodocs']}
  args={{ 'data-testid': 'radio-keyboard-disabled', disabled: true, onkeydown: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('radio-keyboard-disabled');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    el.focus();
    await userEvent.keyboard('{space}');
    expect(args.onkeydown).not.toHaveBeenCalled();
  }}
/>

<Story
  name="Checked state is reflected"
  tags={['!autodocs']}
  args={{ 'data-testid': 'radio-checked', checked: true }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('radio-checked');
    expect(el).toBeChecked();
  }}
/>

<Story
  name="Name and value attributes are forwarded"
  tags={['!autodocs']}
  args={{ 'data-testid': 'radio-attrs', name: 'meal-type', value: 'breakfast' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('radio-attrs');
    expect(el).toHaveAttribute('name', 'meal-type');
    expect(el).toHaveAttribute('value', 'breakfast');
  }}
/>
