<!-- app/src/lib/components/molecules/forms/usda-food-search/usda-food-search.svelte -->
<script lang="ts" module>
  export interface FoodResultClient {
    foodId: string;
    externalId: string | null;
    name: string;
    per100g: { protein: number; fat: number; carbs: number; calories: number };
  }
</script>

<script lang="ts">
  import { Input } from '$lib/components/atoms';

  interface Props {
    value: string;
    ariaLabel: string;
    placeholder?: string;
    onSelect: (food: FoodResultClient) => void;
    onInput?: (name: string) => void;
  }

  let { value = $bindable(), ariaLabel, placeholder, onSelect, onInput }: Props = $props();

  const uid = $props.id();
  const listId = `usda-results-${uid}`;
  let results = $state<FoodResultClient[]>([]);
  let open = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function runSearch(q: string) {
    if (q.trim().length < 2) {
      results = [];
      open = false;
      return;
    }
    const res = await fetch(`/admin/usda?q=${encodeURIComponent(q)}`);
    results = res.ok ? ((await res.json()) as FoodResultClient[]) : [];
    open = results.length > 0;
  }

  function handleInput(v: string) {
    value = v;
    onInput?.(v);
    clearTimeout(timer);
    timer = setTimeout(() => runSearch(v), 300);
  }

  function pick(food: FoodResultClient) {
    value = food.name;
    open = false;
    results = [];
    onSelect(food);
  }
</script>

<div data-component="usda-food-search" style="position: relative;">
  <Input
    {placeholder}
    aria-label={ariaLabel}
    aria-expanded={open}
    aria-controls={listId}
    role="combobox"
    bind:value
    showIcon={false}
    oninput={(e) => handleInput((e.currentTarget as HTMLInputElement).value)}
    onkeydown={(e) => {
      if (e.key === 'Escape') open = false;
    }}
  />
  {#if open}
    <ul
      id={listId}
      role="listbox"
      data-usda-results
      style="position:absolute; z-index:50; inset-inline:0; margin:0; padding:var(--space-1); list-style:none; background:var(--surface-raised); border:1px solid var(--border); border-radius:var(--radius-md); box-shadow:var(--shadow-md); max-height:16rem; overflow:auto;"
    >
      {#each results as food (food.foodId)}
        <li role="option" aria-selected="false">
          <button
            type="button"
            onclick={() => pick(food)}
            style="display:flex; flex-direction:column; gap:2px; width:100%; text-align:start; background:none; border:none; padding:var(--space-2); border-radius:var(--radius-sm); cursor:pointer;"
          >
            <span style="font-weight:var(--font-medium);">{food.name}</span>
            <span style="font-size:var(--text-xs); color:var(--text-muted);">
              {food.per100g.calories} kcal · {food.per100g.protein}g protein / 100g
            </span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
