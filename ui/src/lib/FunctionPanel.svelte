<script lang="ts">
	import { Button, Checkbox, Cluster, FormField, Text, Heading, Input, Table } from "@wildmuse/ui";
	import type { IPlayground } from "./playground.svelte";

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
</script>

<section class="panel">
  <Cluster>
    <Table>
      <caption><Heading level={3}>Custom Functions</Heading></caption>
      <thead>
        <tr>
          <th scope="col">Active</th>
          <th scope="col">Name</th>
          <th scope="col">Params</th>
          <th scope="col">Body</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>
      <tbody>
        {#each pg.fnRows as row (row.id)}
        <tr class:is-disabled={!row.enabled}>
          <td class="c-active">
            <Checkbox
            bind:checked={pg.fnRows[i].enabled}
            aria-label={`Toggle ${row.name || 'function'}`}
          />
        </td>
        <td>
          <Input
            bind:value={pg.fnRows[i].name}
            showIcon={false}
            placeholder="name"
            aria-label="Function name"
          />
        </td>
        <td class="c-value">
          <Input
            bind:value={pg.fnRows[i].params}
            showIcon={false}
            aria-label="Function Parameters, comma separated"
            aria-invalid={row.enabled}
          />
        </td>
        <td class="c-value">
          <Input
            bind:value={pg.fnRows[i].body}
            showIcon={false}
            aria-label="Function Body"
          />
        </td>
        <td class="c-remove">
          <Button
            variant="ghost"
            aria-label={`Remove ${row.name || 'function'}`}
            onclick={() => {
              const id = row.id;
              pg.removeFn(id)
            }}>✕</Button
          >
        </td>
      </tr>
      {:else}
      <tr>
        <td colspan="5" class="empty">
          <Text as="span" color="faint">No Functions yet — add one below.</Text>
        </td>
      </tr>
      {/each}
      <tr>
        <td>Active</td>
        <td>Name</td>
        <td>Params</td>
        <td>Body</td>
        <td>Remove</td>
      </tr>
    </tbody>
  </Table>
  <form
  class="add"
  onsubmit={(e) => {
    e.preventDefault();
    pg.addFn(newFnRow.name, newFnRow.params, newFnRow.body);
    }}
>
  <FormField label="Name" bind:value={newFnRow.name} placeholder="e.g. LEVEL" />
  <FormField label="Params" bind:value={newFnRow.params} placeholder="DEX, STR, x, y" />
  <FormField label="Function Body" bind:value={newFnRow.body} />
  <Button type="submit" variant="primary" disabled={newFnRow.name.trim() === ''}
    >Add Function</Button
  >
</form>
</Cluster>
</section>