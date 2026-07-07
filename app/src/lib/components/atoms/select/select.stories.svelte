<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Select from './select.svelte';
  import { expect } from 'storybook/test';
  import FormElementDecorator from '../formElementDecorator.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Form Controls/Select',
    component: Select,
    tags: ['autodocs'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: [() => ({ Component: FormElementDecorator as any })],
  });
</script>

<!-- Visual stories -->
<Story name="Default">
  <option value="pasta">Pasta</option>
  <option value="salad">Salad</option>
  <option value="soup">Soup</option>
</Story>

<Story name="Disabled" args={{ disabled: true }}>
  <option value="pasta">Pasta</option>
</Story>

<!-- Tests -->
<Story
  name="Renders a select element with data-component"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('combobox');
    expect(el).toHaveAttribute('data-component', 'select');
  }}
>
  <option value="pasta">Pasta</option>
</Story>

<Story
  name="Renders children as options"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('combobox');
    expect(el.querySelectorAll('option')).toHaveLength(3);
  }}
>
  <option value="pasta">Pasta</option>
  <option value="salad">Salad</option>
  <option value="soup">Soup</option>
</Story>

<Story
  name="Disabled attribute passes through"
  tags={['!autodocs']}
  args={{ disabled: true }}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('combobox');
    expect(el).toBeDisabled();
  }}
>
  <option value="pasta">Pasta</option>
</Story>
