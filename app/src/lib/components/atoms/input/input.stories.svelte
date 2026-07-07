<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from './input.svelte';
  import { expect, fn, userEvent } from 'storybook/test';
  import FormElementDecorator from '../formElementDecorator.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Form Controls/Input',
    component: Input,
    tags: ['autodocs'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: [() => ({ Component: FormElementDecorator as any })],
    argTypes: {
      inputType: {
        control: 'select',
        options: [
          'text',
          'email',
          'password',
          'number',
          'search',
          'tel',
          'url',
          'date',
          'time',
          'datetime-local',
          'month',
          'week',
          'hidden',
        ],
        description: 'Native input type and icon selector.',
        table: { defaultValue: { summary: '"text"' } },
      },
      disabled: {
        control: 'boolean',
        description:
          'Suppresses input/change events and sets `aria-disabled="true"`. The element stays focusable.',
        table: { defaultValue: { summary: 'false' } },
      },
      showIcon: {
        control: 'boolean',
        description: 'Show the leading type icon.',
        table: { defaultValue: { summary: 'true' } },
      },
      oninput: { description: 'Called on input when not disabled.' },
      onchange: { description: 'Called on change when not disabled.' },
    },
  });
</script>

<Story name="Default" />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Text" args={{ inputType: 'text', placeholder: 'Enter text...' }} />
<Story name="Email" args={{ inputType: 'email', placeholder: 'you@example.com' }} />
<Story name="Password" args={{ inputType: 'password', placeholder: 'Enter password...' }} />
<Story name="Number" args={{ inputType: 'number', placeholder: '0' }} />
<Story name="Search" args={{ inputType: 'search', placeholder: 'Search...' }} />
<Story name="Tel" args={{ inputType: 'tel', placeholder: '+1 (555) 000-0000' }} />
<Story name="URL" args={{ inputType: 'url', placeholder: 'https://example.com' }} />
<Story name="Date" args={{ inputType: 'date' }} />
<Story name="Time" args={{ inputType: 'time' }} />
<Story name="Datetime Local" args={{ inputType: 'datetime-local' }} />
<Story name="Month" args={{ inputType: 'month' }} />
<Story name="Week" args={{ inputType: 'week' }} />
<Story name="Hidden" args={{ inputType: 'hidden' }} />

<Story name="With Value" args={{ value: 'Hello, World!' }} />

<Story
  name="Value is reflected in input"
  tags={['!autodocs']}
  args={{ 'data-testid': 'input-value', value: 'preset text' }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('input-value');
    expect(el).toHaveValue(args.value);
  }}
/>

<Story
  name="Disabled input is non-interactive"
  tags={['!autodocs']}
  args={{ 'data-testid': 'input-root', disabled: true, oninput: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('input-root');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).not.toBeDisabled();
    await userEvent.type(el, 'hello');
    expect(args.oninput).not.toHaveBeenCalled();
  }}
/>

<Story
  name="Input is interactive"
  tags={['!autodocs']}
  args={{ 'data-testid': 'input-root', oninput: fn() }}
  play={async ({ canvas, args }) => {
    const el = canvas.getByTestId('input-root');
    expect(el).not.toHaveAttribute('aria-disabled');
    expect(el).not.toBeDisabled();
    await userEvent.type(el, 'hello');
    expect(args.oninput).toHaveBeenCalled();
  }}
/>

<Story
  name="Aria attributes are applied when provided"
  tags={['!autodocs']}
  args={{
    'data-testid': 'input-aria',
    'aria-label': 'Search field',
    'aria-haspopup': 'listbox',
    'aria-describedby': 'hint-id',
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('input-aria');
    expect(el).toHaveAttribute('aria-label', 'Search field');
    expect(el).toHaveAttribute('aria-haspopup', 'listbox');
    expect(el).toHaveAttribute('aria-describedby', 'hint-id');
  }}
/>

<Story
  name="Aria attributes are absent by default"
  tags={['!autodocs']}
  args={{ 'data-testid': 'input-no-aria' }}
  play={async ({ canvas }) => {
    const input = canvas.getByTestId('input-no-aria');
    expect(input).not.toHaveAttribute('aria-label');
    expect(input).not.toHaveAttribute('aria-haspopup');
    expect(input).not.toHaveAttribute('aria-describedby');
  }}
/>

<Story
  name="Shows icon by default"
  tags={['!autodocs']}
  args={{ 'data-testid': 'input-with-icon' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('input-with-icon');
    expect(el.parentElement?.querySelector('svg')).not.toBeNull();
  }}
/>

<Story
  name="Does not show icon when showIcon is false"
  tags={['!autodocs']}
  args={{ 'data-testid': 'input-no-icon', showIcon: false }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('input-no-icon');
    expect(el.parentElement?.querySelector('svg')).toBeNull();
  }}
/>
