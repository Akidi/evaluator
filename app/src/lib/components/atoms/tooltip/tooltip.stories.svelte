<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tooltip from './tooltip.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story name="Default">
  {#snippet template()}
    <Tooltip>
      {#snippet content()}Add to favourites{/snippet}
      <button type="button">★</button>
    </Tooltip>
  {/snippet}
</Story>

<Story name="Placements">
  {#snippet template()}
    <div style="display:flex; gap:4rem; padding:4rem; justify-content:center;">
      {#each ['N', 'S', 'E', 'W'] as const as p (p)}
        <Tooltip placement={p}>
          {#snippet content()}Opens {p}{/snippet}
          <button type="button">{p}</button>
        </Tooltip>
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Rich content">
  {#snippet template()}
    <Tooltip placement="E">
      {#snippet content()}
        <strong>Strength</strong><br />Raises melee damage and carry weight.
      {/snippet}
      <button type="button">STR</button>
    </Tooltip>
  {/snippet}
</Story>

<!-- Tests -->
<Story
  name="Renders tooltip content"
  tags={['!autodocs']}
  play={async ({ canvas }) => {
    const el = canvas.getByRole('tooltip');
    expect(el).toBeTruthy();
    expect(el).toHaveTextContent('Save recipe');
  }}
>
  {#snippet template()}
    <Tooltip>
      {#snippet content()}Save recipe{/snippet}
      <button type="button">Save</button>
    </Tooltip>
  {/snippet}
</Story>

<Story
  name="Has data-component attribute"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="tooltip"]');
    expect(el).toBeTruthy();
  }}
>
  {#snippet template()}
    <Tooltip>
      {#snippet content()}Save recipe{/snippet}
      <button type="button">Save</button>
    </Tooltip>
  {/snippet}
</Story>

<Story
  name="Trigger has aria-describedby pointing to tooltip"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-tooltip-trigger]');
    const tooltip = canvasElement.querySelector('[role="tooltip"]');
    expect(trigger?.getAttribute('aria-describedby')).toBe(tooltip?.id);
  }}
>
  {#snippet template()}
    <Tooltip>
      {#snippet content()}Save recipe{/snippet}
      <button type="button">Save</button>
    </Tooltip>
  {/snippet}
</Story>

<Story
  name="Defaults to N placement"
  tags={['!autodocs']}
  play={async ({ canvasElement }) => {
    const tooltip = canvasElement.querySelector('[data-tooltip-content]');
    expect(tooltip?.getAttribute('data-placement')).toBe('N');
  }}
>
  {#snippet template()}
    <Tooltip>
      {#snippet content()}Save recipe{/snippet}
      <button type="button">Save</button>
    </Tooltip>
  {/snippet}
</Story>
