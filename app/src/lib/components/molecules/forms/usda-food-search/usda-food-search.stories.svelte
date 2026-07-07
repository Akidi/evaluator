<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, userEvent, waitFor } from 'storybook/test';
  import UsdaFoodSearch from './usda-food-search.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Forms/UsdaFoodSearch',
    component: UsdaFoodSearch,
    tags: ['autodocs'],
  });

  const sample = [
    {
      foodId: 'f1',
      externalId: '111',
      name: 'Broccoli, raw',
      per100g: { protein: 2.8, fat: 0.4, carbs: 6.6, calories: 34 },
    },
  ];
</script>

<Story
  name="Search and select"
  args={{ value: '', ariaLabel: 'Search foods', placeholder: 'Search USDA foods…', onSelect: fn() }}
  play={async ({ canvas, args, step }) => {
    const fetchMock = fn(async () => new Response(JSON.stringify(sample)));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await step('type a query', async () => {
      const input = canvas.getByRole('combobox');
      await userEvent.type(input, 'broccoli');
    });

    await step('result appears and can be picked', async () => {
      const option = await waitFor(() => canvas.getByText('Broccoli, raw'));
      await userEvent.click(option);
      expect(args.onSelect).toHaveBeenCalledWith(sample[0]);
    });
  }}
/>
