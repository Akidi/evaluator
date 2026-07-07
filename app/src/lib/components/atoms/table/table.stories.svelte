<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Table from './table.svelte';
  import TableHead from './table-head.svelte';
  import TableBody from './table-body.svelte';
  import TableRow from './table-row.svelte';
  import TableCell from './table-cell.svelte';
  import TableHeader from './table-header.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Display/Table',
    component: Table,
    tags: ['autodocs'],
  });
</script>

<Story name="Default">
  <Table>
    <TableHead>
      <TableRow>
        <TableHeader>Name</TableHeader>
        <TableHeader>Calories</TableHeader>
        <TableHeader>Prep time</TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Pasta Primavera</TableCell>
        <TableCell>420</TableCell>
        <TableCell>30 min</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Caesar Salad</TableCell>
        <TableCell>310</TableCell>
        <TableCell>15 min</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</Story>

<Story name="With caption">
  <Table caption="Weekly Recipes">
    <TableHead>
      <TableRow>
        <TableHeader>Name</TableHeader>
        <TableHeader>Calories</TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Pasta Primavera</TableCell>
        <TableCell>420</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</Story>

<!-- Tests -->

<Story
  name="Table has data-component attribute"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="table"]')).toBeTruthy();
  }}
>
  <Table><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>
</Story>

<Story
  name="TableHead has data-component attribute"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="table-head"]')).toBeTruthy();
  }}
>
  <Table><TableHead><TableRow><TableHeader>x</TableHeader></TableRow></TableHead></Table>
</Story>

<Story
  name="TableBody has data-component attribute"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="table-body"]')).toBeTruthy();
  }}
>
  <Table><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>
</Story>

<Story
  name="TableRow has data-component attribute"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="table-row"]')).toBeTruthy();
  }}
>
  <Table><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>
</Story>

<Story
  name="TableCell has data-component attribute"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="table-cell"]')).toBeTruthy();
  }}
>
  <Table><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>
</Story>

<Story
  name="TableHeader has data-component attribute"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="table-header"]')).toBeTruthy();
  }}
>
  <Table><TableHead><TableRow><TableHeader>x</TableHeader></TableRow></TableHead></Table>
</Story>

<Story
  name="TableHeader defaults scope to col"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="table-header"]')).toHaveAttribute(
      'scope',
      'col',
    );
  }}
>
  <Table><TableHead><TableRow><TableHeader>Name</TableHeader></TableRow></TableHead></Table>
</Story>

<Story
  name="TableCell renders children"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="table-cell"]')).toHaveTextContent(
      'Pasta Primavera',
    );
  }}
>
  <Table><TableBody><TableRow><TableCell>Pasta Primavera</TableCell></TableRow></TableBody></Table>
</Story>

<Story
  name="TableHeader renders children"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="table-header"]')).toHaveTextContent(
      'Recipe',
    );
  }}
>
  <Table><TableHead><TableRow><TableHeader>Recipe</TableHeader></TableRow></TableHead></Table>
</Story>

<Story
  name="Table renders correct number of rows"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelectorAll('[data-component="table-row"]')).toHaveLength(3);
  }}
>
  <Table>
    <TableBody>
      <TableRow><TableCell>A</TableCell></TableRow>
      <TableRow><TableCell>B</TableCell></TableRow>
      <TableRow><TableCell>C</TableCell></TableRow>
    </TableBody>
  </Table>
</Story>

<Story
  name="Table renders caption when provided"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    const caption = canvasElement.querySelector('caption');
    expect(caption).toBeTruthy();
    expect(caption).toHaveTextContent('Weekly Recipes');
  }}
>
  <Table caption="Weekly Recipes"
    ><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table
  >
</Story>

<Story
  name="Table does not render caption when not provided"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('caption')).toBeNull();
  }}
>
  <Table><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>
</Story>

<Story
  name="Table wrapper renders as scrollable container"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="table-wrapper"]')).toBeTruthy();
  }}
>
  <Table><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>
</Story>
