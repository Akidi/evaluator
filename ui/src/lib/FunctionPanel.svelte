<script lang="ts">
	import { Heading, Button, FormField, Text } from "@wildmuse/ui";
	import type { IPlayground } from "./playground.svelte";
	import EvalTable from "./EvalTable.svelte";

  interface Props {
    pg: IPlayground
  }

  let { pg }: Props = $props();

  interface FnRow {
    name: string
    params: string
    body: string
  }

  const defaultFnRow: FnRow = Object.freeze({
    kind: 'fn',
    name: '',
    params: '',
    body: '',
  });

  let newFnRow = $state<FnRow>({...defaultFnRow});
  const headers = ["name", "params", "body"]
</script>

<section class="panel">
  <header class="panel__head">
    <Heading level={2} size="sm">Custom Functions</Heading>
    <Text as="span" size="sm" color="muted"
      >Reusable helpers callable from any formula. Only active rows are in scope.</Text
    >
  </header>

  <EvalTable getRows="fn" {pg} {headers} />

  <form
    class="add"
    onsubmit={(e) => {
      e.preventDefault();
      pg.addFn(newFnRow.name, newFnRow.params, newFnRow.body);
      newFnRow = {...defaultFnRow};
    }}
  >
    <div class="add__fields">
      <FormField label="Name" bind:value={newFnRow.name} placeholder="e.g. LEVEL" />
      <FormField label="Params" bind:value={newFnRow.params} placeholder="DEX, STR, x, y" />
      <FormField label="Function Body" bind:value={newFnRow.body} placeholder="DEX * 2 + STR" />
    </div>
    <Button type="submit" variant="primary" disabled={newFnRow.name.trim() === ''}
      >Add Function</Button
    >
  </form>
</section>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .panel__head {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .add {
    --add-border: var(--color-border, color-mix(in srgb, currentColor 16%, transparent));
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 0.75rem;
    padding: 0.9rem 1rem;
    border: 1px dashed var(--add-border);
    border-radius: 0.625rem;
    background: color-mix(in srgb, currentColor 3%, transparent);
  }

  .add__fields {
    flex: 1 1 18rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
    gap: 0.75rem;
  }

  .add :global(button[type='submit']) {
    flex: 0 0 auto;
  }
</style>