<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './button.svelte';
  import { expect, userEvent, fn } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Actions/Button',
    component: Button,
    tags: ['autodocs'],
    args: {
      onclick: fn(),
    },
    argTypes: {
      // --- Appearance ---
      variant: {
        control: 'select',
        options: [undefined, 'primary', 'secondary', 'accent', 'ghost'],
        description: 'Visual style variant. Omit for an unstyled button.',
        table: { defaultValue: { summary: 'undefined' } },
      },
      // --- Behaviour ---
      type: {
        control: 'inline-radio',
        options: ['button', 'submit', 'reset'],
        description:
          'Native button type. Always defaults to `"button"` to avoid implicit form submission.',
        table: { defaultValue: { summary: '"button"' } },
      },
      disabled: {
        control: 'boolean',
        description:
          'Suppresses click events and sets `aria-disabled="true"`. The element stays focusable.',
        table: { defaultValue: { summary: 'false' } },
      },
      loading: {
        control: 'boolean',
        description: 'Indicates an in-progress async action. Suppresses clicks like `disabled`.',
        table: { defaultValue: { summary: 'false' } },
      },
      onclick: {
        description: 'Called on click when not disabled or loading.',
      },
      // --- Links ---
      href: {
        control: 'text',
        description: 'When provided, renders as an <a> element instead of <button>.',
        table: { defaultValue: { summary: 'undefined' } },
      },
    },
  });
</script>

<Story name="Default">Button</Story>

<Story name="Disabled" args={{ disabled: true }}>Disabled Button</Story>

<Story name="Primary" args={{ variant: 'primary' }}>Primary Button</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>Secondary Button</Story>

<Story name="Accent" args={{ variant: 'accent' }}>Accent Button</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>Ghost Button</Story>

<Story
  name="Disabled button is non-interactive"
  tags={['!autodocs']}
  args={{ disabled: true, 'data-testid': 'btn-disabled', onkeydown: fn(), onclick: fn() }}
  play={async ({ canvas, args }) => {
    const btn = canvas.getByTestId('btn-disabled');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    expect(btn).not.toBeDisabled();
    await userEvent.click(btn);
    btn.focus();
    await userEvent.keyboard('{enter}');
    await userEvent.keyboard('{space}');
    expect(args.onclick).not.toHaveBeenCalled();
    expect(args.onkeydown).not.toHaveBeenCalled();
  }}
>
  Button
</Story>

<Story
  name="Button is interactive"
  tags={['!autodocs']}
  args={{
    'data-testid': 'btn-interactive',
    onclick: fn(),
  }}
  play={async ({ canvas, args }) => {
    const btn = canvas.getByTestId('btn-interactive');
    expect(btn).not.toHaveAttribute('aria-disabled');
    expect(btn).not.toBeDisabled();
    await userEvent.click(btn);
    expect(args.onclick).toHaveBeenCalledOnce();
  }}
>
  Button
</Story>

<Story
  name="Button fires onclick on keyboard activation"
  tags={['!autodocs']}
  args={{ 'data-testid': 'btn-keyboard', onclick: fn() }}
  play={async ({ canvas, args }) => {
    const btn = canvas.getByTestId('btn-keyboard');
    btn.focus();
    await userEvent.keyboard('{enter}');
    expect(args.onclick).toHaveBeenCalledOnce();
  }}
>
  Button
</Story>

<Story name="Loading Button" args={{ loading: true }}>Saving…</Story>

<Story
  name="Loading button is non-interactive"
  tags={['!autodocs']}
  args={{ loading: true, 'data-testid': 'btn-loading', onclick: fn(), onkeydown: fn() }}
  play={async ({ canvas, args }) => {
    const btn = canvas.getByTestId('btn-loading');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    btn.focus();
    await userEvent.keyboard('{enter}');
    await userEvent.keyboard('{space}');
    expect(args.onclick).not.toHaveBeenCalled();
    expect(args.onkeydown).not.toHaveBeenCalled();
  }}
>
  Button
</Story>

<Story
  name="Link"
  tags={['!autodocs']}
  args={{ href: '/example', 'data-testid': 'btn-link' }}
  play={async ({ canvas }) => {
    const link = canvas.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/example');
  }}
>
  Link Button
</Story>

<Story
  name="LinkPrimary"
  tags={['!autodocs']}
  args={{ href: '/example', variant: 'primary', 'data-testid': 'btn-link-primary' }}
  play={async ({ canvas }) => {
    const link = canvas.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/example');
    expect(link).toHaveAttribute('data-variant', 'primary');
  }}
>
  Link Primary Button
</Story>

<Story
  name="LinkGhost"
  tags={['!autodocs']}
  args={{ href: '/example', variant: 'ghost', 'data-testid': 'btn-link-ghost' }}
  play={async ({ canvas }) => {
    const link = canvas.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/example');
    expect(link).toHaveAttribute('data-variant', 'ghost');
  }}
>
  Link Ghost Button
</Story>
