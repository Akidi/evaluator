<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import InputTypeIcon from './InputTypeIcon.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Form Controls/InputTypeIcon',
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Decorative icons indicating expected input type. All are `aria-hidden="true"` — purely visual. ' +
            '`hidden` type renders nothing.',
        },
      },
    },
  });

  const types = [
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
  ] as const;
</script>

<Story name="All icons">
  <div class="icon-grid">
    {#each types as type (type)}
      <div class="icon-item">
        <div class="icon-preview">
          <InputTypeIcon {type} size={24} />
        </div>
        <code class="icon-label">{type}</code>
      </div>
    {/each}
  </div>
</Story>

<Story name="Sizes">
  <div class="size-row">
    {#each [12, 16, 20, 24, 32] as size (size)}
      <div class="icon-item">
        <div class="icon-preview">
          <InputTypeIcon type="email" {size} />
        </div>
        <code class="icon-label">{size}px</code>
      </div>
    {/each}
  </div>
</Story>

<style>
  .icon-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .size-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .icon-preview {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-sunken);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    color: var(--text);
  }

  .icon-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-align: center;
  }
</style>
