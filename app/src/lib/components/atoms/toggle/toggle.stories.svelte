<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Toggle from './toggle.svelte';
  import FormElementDecorator from '../formElementDecorator.svelte';
  import { expect, fn, userEvent } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Form Controls/Toggle',
    component: Toggle,
    tags: ['autodocs'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: [() => ({ Component: FormElementDecorator as any })],
    argTypes: {
      checked: {
        control: 'boolean',
        description: 'Whether the switch is on.',
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

<Story name="On" args={{ checked: true }} />

<Story
  name="Aria attributes are applied when provided"
  tags={['!autodocs']}
  args={{
    'data-testid': 'toggle-aria',
    'aria-label': 'Enable notifications',
    'aria-describedby': 'hint-id',
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('toggle-aria');
    expect(el).toHaveAttribute('aria-label', 'Enable notifications');
    expect(el).toHaveAttribute('aria-describedby', 'hint-id');
  }}
/>

<Story
  name="Not interactive when disabled"
  tags={['!autodocs']}
  args={{ 'data-testid': 'toggle-disabled', disabled: true, onkeydown: fn(), onclick: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('toggle-disabled');
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
  args={{ 'data-testid': 'toggle-interactive', onclick: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('toggle-interactive');
    expect(el).not.toHaveAttribute('aria-disabled');
    await userEvent.click(el);
    expect(args.onclick).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Fires onkeydown on Space key"
  tags={['!autodocs']}
  args={{ 'data-testid': 'toggle-keyboard', onkeydown: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('toggle-keyboard');
    el.focus();
    await userEvent.keyboard('{space}');
    expect(args.onkeydown).toHaveBeenCalledOnce();
  }}
/>

<Story
  name="Doesn't fire keydown when disabled"
  tags={['!autodocs']}
  args={{ 'data-testid': 'toggle-keyboard-disabled', disabled: true, onkeydown: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('toggle-keyboard-disabled');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    el.focus();
    await userEvent.keyboard('{space}');
    expect(args.onkeydown).not.toHaveBeenCalled();
  }}
/>

<Story
  name="Checked state is reflected"
  tags={['!autodocs']}
  args={{ 'data-testid': 'toggle-checked', checked: true }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('toggle-checked');
    expect(el).toBeChecked();
  }}
/>
