<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Checkbox from './checkbox.svelte';
  import FormElementDecorator from '../formElementDecorator.svelte';
  import { expect, fn, userEvent } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Form Controls/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: [() => ({ Component: FormElementDecorator as any })],
    argTypes: {
      checked: {
        control: 'boolean',
        description: 'Whether the checkbox is checked.',
        table: { defaultValue: { summary: 'false' } },
      },
      indeterminate: {
        control: 'boolean',
        description:
          'Puts the checkbox in the indeterminate (mixed) state. Takes visual precedence over `checked`.',
        table: { defaultValue: { summary: 'false' } },
      },
      disabled: {
        control: 'boolean',
        description:
          'Suppresses click/keydown events and sets `aria-disabled="true"`. The element stays focusable.',
        table: { defaultValue: { summary: 'false' } },
      },
      onclick: { description: 'Called on click when not disabled.' },
      onkeydown: { description: 'Called on keydown when not disabled.' },
    },
  });
</script>

<Story name="Default" />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Checked" args={{ checked: true }} />

<Story name="Indeterminate" args={{ indeterminate: true }} />

<Story
  name="Aria attributes are applied when provided"
  tags={['!autodocs']}
  args={{
    'data-testid': 'checkbox-aria',
    'aria-label': 'Accept terms',
    'aria-describedby': 'hint-id',
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('checkbox-aria');
    expect(el).toHaveAttribute('aria-label', 'Accept terms');
    expect(el).toHaveAttribute('aria-describedby', 'hint-id');
  }}
/>

<Story
  name="Not interactive when disabled"
  tags={['!autodocs']}
  args={{ 'data-testid': 'checkbox-disabled', disabled: true, onkeydown: fn(), onclick: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('checkbox-disabled');
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
  args={{ 'data-testid': 'checkbox-interactive', onclick: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('checkbox-interactive');
    expect(el).not.toHaveAttribute('aria-disabled');
    await userEvent.click(el);
    expect(args.onclick).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Fires onkeydown on Space key"
  tags={['!autodocs']}
  args={{ 'data-testid': 'checkbox-keyboard', onkeydown: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('checkbox-keyboard');
    el.focus();
    await userEvent.keyboard('{space}');
    expect(args.onkeydown).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Doesn't Fire keydown when disabled"
  tags={['!autodocs']}
  args={{ 'data-testid': 'checkbox-keyboard-disabled', disabled: true, onkeydown: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('checkbox-keyboard-disabled');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    el.focus();
    await userEvent.keyboard('{space}');
    expect(args.onkeydown).not.toHaveBeenCalled();
  }}
/>

<Story
  name="Indeterminate state is set on element"
  tags={['!autodocs']}
  args={{ 'data-testid': 'checkbox-indeterminate', indeterminate: true }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('checkbox-indeterminate') as HTMLInputElement;
    expect(el.indeterminate).toBe(true);
  }}
/>

<Story
  name="Checked state is reflected"
  tags={['!autodocs']}
  args={{ 'data-testid': 'checkbox-checked', checked: true }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('checkbox-checked');
    expect(el).toBeChecked();
  }}
/>
