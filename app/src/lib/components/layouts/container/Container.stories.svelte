<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import Container from './Container.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layouts/Container',
    component: Container,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Container establishes a CSS container query context (`container-type: inline-size`). ' +
            "Children can then use `@container` queries to respond to this element's width rather than the viewport. " +
            'Use `name` when you have nested containers and need to target a specific one.',
        },
      },
    },
  });
</script>

<Story
  name="Unnamed container"
  parameters={{
    docs: {
      description: {
        story:
          'Resize the canvas — the child switches from a single column to two columns at 400px. This is driven by `@container` not `@media`.',
      },
    },
  }}
>
  <Container style="background: var(--surface-sunken); padding: 0.5rem;">
    <div class="demo-grid">
      <div class="demo-card">Card A</div>
      <div class="demo-card">Card B</div>
      <div class="demo-card">Card C</div>
      <div class="demo-card">Card D</div>
    </div>
  </Container>
</Story>

<Story
  name="Named container"
  parameters={{
    docs: {
      description: {
        story:
          'Named `card` container — the inner card switches from stacked to side-by-side at 350px using `@container card`. Resize to see it switch.',
      },
    },
  }}
>
  <Container name="card" style="background: var(--surface-sunken); padding: 0.5rem;">
    <div class="demo-named-card">
      <div class="demo-named-card-img"></div>
      <div class="demo-named-card-body">
        <p><strong>Card title</strong></p>
        <p>Card body text that reflows based on the container width, not the viewport.</p>
      </div>
    </div>
  </Container>
</Story>

<Story
  name="Sets container-type inline-size"
  parameters={{
    docs: {
      description: {
        story:
          "Verifies `container-type: inline-size` is present in the element's style for anonymous containers.",
      },
    },
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('container-el');
    const parent = el.closest('[data-layout="container"]') as HTMLElement;
    const style = parent?.getAttribute('style') ?? '';
    expect(style).toContain('container-type: inline-size');
  }}
>
  <Container>
    <span
      data-testid="container-el"
      style="display:block; background: var(--primary-bg); padding: var(--space-2);">content</span
    >
  </Container>
</Story>

<Story
  name="Named container uses container shorthand"
  parameters={{
    docs: {
      description: {
        story:
          'Verifies named containers use the `container: name / inline-size` shorthand instead of just `container-type`.',
      },
    },
  }}
  play={async ({ canvas }) => {
    const el = canvas.getByTestId('named-container-el');
    const parent = el.closest('[data-layout="container"]') as HTMLElement;
    const style = parent?.getAttribute('style') ?? '';
    expect(style).toContain('sidebar');
  }}
>
  <Container name="sidebar" style="background: var(--primary-bg); padding: var(--space-2);">
    <span data-testid="named-container-el" style="display:block">content</span>
  </Container>
</Story>

<style>
  .demo-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  @container (min-width: 400px) {
    .demo-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .demo-card {
    background: var(--primary-bg-emphasis);
    padding: 0.75rem;
    border-radius: 3px;
    text-align: center;
  }

  .demo-named-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: var(--surface-raised);
    border-radius: 3px;
    overflow: hidden;
  }

  @container card (min-width: 350px) {
    .demo-named-card {
      flex-direction: row;
    }

    .demo-named-card-img {
      flex-shrink: 0;
      width: 120px;
    }
  }

  .demo-named-card-img {
    background: var(--primary-bg-emphasis);
    min-height: 80px;
  }

  .demo-named-card-body {
    padding: 0.75rem;
  }
</style>
