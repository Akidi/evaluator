<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import StepCard from './step-card.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Display/StepCard',
    component: StepCard,
    tags: ['autodocs'],
    args: { step: 1 },
  });
</script>

<Story name="Default" args={{ step: 1 }}>Bring a large pot of salted water to a boil.</Story>

<Story name="Long instruction" args={{ step: 2 }}>
  Fold the egg whites gently into the mixture using a metal spoon, being careful not to knock out
  all the air you have incorporated.
</Story>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="step-card"]')).toBeTruthy();
  }}
>
  Bring a large pot of salted water to a boil.
</Story>

<Story
  name="Renders step number"
  tags={['!autodocs']}
  args={{ step: 3 }}
  play={async ({ canvas }) => {
    expect(canvas.getByText('3')).toBeTruthy();
  }}
>
  Boil the pasta until al dente.
</Story>

<Story
  name="Renders instruction text"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    expect(canvas.getByText('Bring a large pot of salted water to a boil.')).toBeTruthy();
  }}
>
  Bring a large pot of salted water to a boil.
</Story>
