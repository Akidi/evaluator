<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Textarea from './textarea.svelte';
  import FormElementDecorator from '../formElementDecorator.svelte';
  import { expect, fn, userEvent } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Form Controls/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: [() => ({ Component: FormElementDecorator as any })],
    argTypes: {
      disabled: {
        control: 'boolean',
        description:
          'Suppresses input events and sets `aria-disabled="true"`. The element stays focusable.',
        table: { defaultValue: { summary: 'false' } },
      },
      placeholder: {
        control: 'text',
        description: 'Placeholder text shown when the field is empty.',
      },
      rows: {
        control: 'number',
        description: 'Visible number of text lines.',
        table: { defaultValue: { summary: '3' } },
      },
      value: {
        control: 'text',
        description: 'Current value of the textarea.',
      },
      oninput: { description: 'Called on input when not disabled.' },
    },
  });
</script>

<Story name="Default" />

<Story name="With placeholder" args={{ placeholder: 'Write something…' }} />

<Story name="With value" args={{ value: 'Hello, world!' }} />

<Story name="Disabled" args={{ disabled: true, value: 'Read only content' }} />

<Story name="Rows" args={{ rows: 6, placeholder: 'Tall textarea' }} />

<Story
  name="Aria attributes are applied when provided"
  tags={['!autodocs']}
  args={{
    'data-testid': 'textarea-aria',
    'aria-label': 'Message',
    'aria-describedby': 'hint-id',
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('textarea-aria');
    expect(el).toHaveAttribute('aria-label', 'Message');
    expect(el).toHaveAttribute('aria-describedby', 'hint-id');
  }}
/>

<Story
  name="Not interactive when disabled"
  tags={['!autodocs']}
  args={{ 'data-testid': 'textarea-disabled', disabled: true, oninput: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('textarea-disabled');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).not.toBeDisabled();
    await userEvent.click(el);
    await userEvent.type(el, 'hello');
    expect(args.oninput).not.toHaveBeenCalled();
  }}
/>

<Story
  name="Fires oninput when typing"
  tags={['!autodocs']}
  args={{ 'data-testid': 'textarea-interactive', oninput: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('textarea-interactive');
    expect(el).not.toHaveAttribute('aria-disabled');
    await userEvent.type(el, 'hi');
    expect(args.oninput).toHaveBeenCalled();
  }}
/>

<Story
  name="Value is reflected"
  tags={['!autodocs']}
  args={{ 'data-testid': 'textarea-value', value: 'preset text' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('textarea-value') as HTMLTextAreaElement;
    expect(el.value).toBe('preset text');
  }}
/>
