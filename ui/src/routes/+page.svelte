<script lang="ts">
	import { Formulate } from "@formula/core";
	import { Input, LabeledValue, Button, Heading, Checkbox, Table } from "@wildmuse/ui";

  type ScopeRow = { id: number; name: string; value: string; enabled: boolean };

  const formulate = new Formulate();
  let formula = $state('');
  let result = $state();
  let error = $state('');
  let rows = $state<ScopeRow[]>([]);
  let newRow = $state({
    name: '',
    value: '',
  });
</script>
<Table>
  <thead>
    <tr>
      <td>Active</td>
      <td>Name</td>
      <td>Value</td>
      <td>Remove</td>
    </tr>
  </thead>
  <tbody>
    {#each rows as row, i (row.id)}
      <tr>
        <td><Checkbox bind:checked={rows[i].enabled}/></td>
        <td>{row.name}</td>
        <td>{row.value}</td>
        <td><Button onclick={() => {const id = row.id; rows = rows.filter(row => row.id !== id)}}>X</Button></td>
      </tr>
    {:else}
      <tr>
        <td colspan="4">No items yet</td>
      </tr>
    {/each}
    <tr>
      <td>Active</td>
      <td>Name</td>
      <td>Value</td>
      <td>Remove</td>
    </tr>
  </tbody>
</Table>
<Heading level={2}>Add Row</Heading>
<LabeledValue label="Name">
  <Input bind:value={newRow.name} />
</LabeledValue>
<LabeledValue label="Value">
  <Input bind:value={newRow.value} />
</LabeledValue>
<Button onclick={() => {
  rows = [...rows, {id: rows.length, enabled: true, ...newRow}];
  newRow = {name: '', value: ''};
}}>Add Row</Button>
<LabeledValue label="Input formula">
<Input bind:value={formula} />
</LabeledValue>
<Button onclick={() => {
    try {
      result = formulate.run(formula);
    } catch (e: unknown) {
      error = String(e);
    }
  } 
}>Submit </Button>
<Heading level={2}>
{#if error != ""}
Error: {error}
{:else if error == "" && result != ""}
Result: {result}
{:else}
Type a formula above.
{/if}
</Heading>