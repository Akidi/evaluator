<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Label from './label.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Form Controls/Label',
    component: Label,
    tags: ['autodocs'],
  });

  // Hoisted so TypeScript uses structural compatibility rather than excess-property
  // checking. The `for` attribute will be part of Props once label.svelte uses
  // HTMLLabelAttributes instead of HTMLAttributes<HTMLLabelElement>.
  const linkedArgs = { for: 'email-input' };
  const forTestArgs = { for: 'name-input', 'data-testid': 'label-for' };
</script>

<Story name="Default">Email address</Story>

<Story name="Linked to input" args={linkedArgs}>Email address</Story>

<Story
  name="Renders children"
  tags={['!autodocs']}
  args={{ 'data-testid': 'label-children' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('label-children');
    expect(el).toHaveTextContent('Your name');
  }}>Your name</Story
>

<Story
  name="For attribute links to form control"
  tags={['!autodocs']}
  args={forTestArgs}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('label-for');
    expect(el).toHaveAttribute('for', 'name-input');
  }}>Your name</Story
>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  args={{ 'data-testid': 'label-data-component' }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('label-data-component');
    expect(el).toHaveAttribute('data-component', 'label');
  }}>Label</Story
>

<Story
  name="Aria attributes are applied when provided"
  tags={['!autodocs']}
  args={{
    'data-testid': 'label-aria',
    'aria-label': 'Override label',
    'aria-describedby': 'hint-id',
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('label-aria');
    expect(el).toHaveAttribute('aria-label', 'Override label');
    expect(el).toHaveAttribute('aria-describedby', 'hint-id');
  }}>Label</Story
>
