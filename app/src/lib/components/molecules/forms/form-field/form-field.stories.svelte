<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FormField from './form-field.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Forms/FormField',
    component: FormField,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story
  name="Default"
  args={{ label: 'Recipe name', name: 'name', placeholder: 'e.g. Carbonara' }}
/>

<Story
  name="Textarea"
  args={{ label: 'Description', as: 'textarea', name: 'description', rows: 3 }}
/>

<Story name="Select" args={{ label: 'Unit', as: 'select', name: 'unit' }}>
  <option value="g">g</option>
  <option value="ml">ml</option>
</Story>

<Story
  name="With hint"
  args={{ label: 'Servings', type: 'number', name: 'servings', hint: 'Enter a whole number' }}
/>

<Story
  name="With error"
  args={{ label: 'Recipe name', name: 'name', error: 'This field is required' }}
/>

<Story name="Required" args={{ label: 'Recipe name', name: 'name', required: true }} />

<!-- Tests -->
<Story
  name="Has data-component attribute"
  args={{ label: 'Name', name: 'name' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="form-field"]')).toBeTruthy();
  }}
/>

<Story
  name="Renders label text"
  args={{ label: 'Recipe name', name: 'name' }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Recipe name')).toBeTruthy();
  }}
/>

<Story
  name="Label is associated with the rendered input"
  args={{ label: 'Recipe name', name: 'name' }}
  play={async ({ canvasElement }) => {
    const label = canvasElement.querySelector<HTMLLabelElement>('[data-form-field-label]');
    const input = canvasElement.querySelector('input');
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(label?.control).toBe(input);
  }}
/>

<Story
  name="Hint is linked via aria-describedby"
  args={{ label: 'Servings', name: 'servings', hint: 'Whole numbers only' }}
  play={async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    const hint = canvasElement.querySelector('[data-form-field-hint]');
    expect(hint).toBeTruthy();
    expect(input?.getAttribute('aria-describedby')).toBe(hint?.id);
  }}
/>

<Story
  name="Error is linked via aria-describedby and sets aria-invalid"
  args={{ label: 'Name', name: 'name', error: 'Required field' }}
  play={async ({ canvas, canvasElement }) => {
    const input = canvasElement.querySelector('input');
    const err = canvasElement.querySelector('[data-form-field-error]');
    expect(canvas.getByRole('alert')).toHaveTextContent('Required field');
    expect(input?.getAttribute('aria-describedby')).toBe(err?.id);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  }}
/>

<Story
  name="Error sets data-invalid on wrapper"
  args={{ label: 'Name', name: 'name', error: 'Required field' }}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="form-field"]')).toHaveAttribute(
      'data-invalid',
    );
  }}
/>

<Story
  name="Select renders options"
  args={{ label: 'Unit', as: 'select', name: 'unit' }}
  play={async ({ canvasElement }) => {
    const select = canvasElement.querySelector('select');
    expect(select).toBeTruthy();
    expect(select?.querySelectorAll('option').length).toBe(2);
  }}
>
  <option value="g">g</option>
  <option value="ml">ml</option>
</Story>
