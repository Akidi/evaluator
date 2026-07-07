<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Card from './card.svelte';
  import { expect } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Content/Card',
    component: Card,
    tags: ['autodocs'],
  });
</script>

<!-- Visual stories -->
<Story name="Body only">
  <p>Simple card with body content only.</p>
</Story>

<Story name="With header and body" asChild>
  <Card>
    {#snippet header()}<h3 style="margin:0">Spaghetti Carbonara</h3>{/snippet}
    <p>A classic Italian pasta dish made with eggs, cheese, and pancetta.</p>
  </Card>
</Story>

<Story name="Full card" asChild>
  <Card>
    {#snippet media()}<div
        style="background:#e2e8f0;height:8rem;display:flex;align-items:center;justify-content:center"
      >
        📷 Image
      </div>{/snippet}
    {#snippet header()}<h3 style="margin:0">Spaghetti Carbonara</h3>{/snippet}
    {#snippet footer()}<div style="display:flex;gap:.5rem">
        <button>Save</button><button>View</button>
      </div>{/snippet}
    <p>A classic Italian pasta dish made with eggs, cheese, and pancetta.</p>
  </Card>
</Story>

<!-- Tests -->
<Story
  name="Renders an article with data-component"
  play={async ({ canvas }) => {
    const el = canvas.getByRole('article');
    expect(el).toHaveAttribute('data-component', 'card');
  }}
>
  <p>Content</p>
</Story>

<Story
  name="Renders body content"
  play={async ({ canvas }) => {
    expect(canvas.getByText('Body text')).toBeTruthy();
  }}
>
  <p>Body text</p>
</Story>

<Story
  name="Renders header slot"
  asChild
  play={async ({ canvasElement }) => {
    const header = canvasElement.querySelector('[data-card-header]');
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent('Card title');
  }}
>
  <Card>
    {#snippet header()}<h3>Card title</h3>{/snippet}
    <p>Content</p>
  </Card>
</Story>

<Story
  name="Renders footer slot"
  asChild
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-card-footer]')).toBeTruthy();
  }}
>
  <Card>
    {#snippet footer()}<button>Action</button>{/snippet}
    <p>Content</p>
  </Card>
</Story>

<Story
  name="Omits media section when not provided"
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-card-media]')).toBeNull();
  }}
>
  <p>Content</p>
</Story>
