<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';
  import SkeletonCard from './skeleton-card.svelte';
  import Skeleton from '$lib/components/atoms/skeleton/skeleton.svelte';
  import Stack from '$lib/components/layouts/stack/Stack.svelte';
  import Cluster from '$lib/components/layouts/cluster/Cluster.svelte';
  import Sidebar from '$lib/components/layouts/sidebar/Sidebar.svelte';

  const { Story } = defineMeta({
    title: 'Components/Molecules/Display/SkeletonCard',
    component: SkeletonCard,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" />

<Story name="Single line" args={{ lines: 1 }} />

<Story name="Title and metadata" args={{ lines: 2 }} />

<Story name="Paragraph block" args={{ lines: 4 }} />

<Story name="Long-form content" args={{ lines: 6 }} />

<!--
  Layout concept mockups — composed directly from atoms/layouts (not through
  SkeletonCard's prop API, which doesn't support these shapes yet). These are
  a design playground: eyeball them, decide which earn a place in the
  component, then drive each one in via the usual one-test-at-a-time TDD flow.
-->
<Story name="Concept — avatar header (user-card style)" asChild>
  <Cluster space="var(--space-2, 0.5rem)">
    <Skeleton variant="circle" width="2.5rem" height="2.5rem" />
    <Stack space="var(--space-1, 0.25rem)">
      <Skeleton variant="text" width="8rem" />
      <Skeleton variant="text" width="5rem" />
    </Stack>
  </Cluster>
</Story>

<Story name="Concept — media block (article/stat preview style)" asChild>
  <Stack>
    <Skeleton width="100%" height="8rem" />
    <Skeleton variant="text" width="100%" />
    <Skeleton variant="text" width="100%" />
    <Skeleton variant="text" width="60%" />
  </Stack>
</Story>

<Story name="Concept — sidebar thumbnail (list-row style)" asChild>
  <Sidebar sideWidth="4rem" space="var(--space-2, 0.5rem)">
    <Skeleton width="4rem" height="4rem" />
    <Stack space="var(--space-1, 0.25rem)">
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="40%" />
    </Stack>
  </Sidebar>
</Story>

<Story name="Concept — stat tile (label + big value)" asChild>
  <Stack space="var(--space-1, 0.25rem)">
    <Skeleton variant="text" width="6rem" height="0.75em" />
    <Skeleton variant="text" width="4rem" height="1.75em" />
  </Stack>
</Story>

<!-- Tests -->
<Story
  name="Renders data-component attribute"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-component="skeleton-card"]')).toBeTruthy();
  }}
/>

<Story
  name="Renders skeleton placeholder shapes"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    expect(canvasElement.querySelectorAll('[data-component="skeleton"]').length).toBeGreaterThan(0);
  }}
/>

<Story
  name="Renders configurable number of text lines"
  tags={['!dev', '!autodocs']}
  args={{ lines: 3 }}
  play={async ({ canvasElement }) => {
    expect(
      canvasElement.querySelectorAll('[data-component="skeleton"][data-variant="text"]').length,
    ).toBe(3);
  }}
/>

<Story
  name="Renders the last line narrower than preceding lines"
  tags={['!dev', '!autodocs']}
  args={{ lines: 3 }}
  play={async ({ canvasElement }) => {
    const skeletons = Array.from(
      canvasElement.querySelectorAll('[data-component="skeleton"][data-variant="text"]'),
    );
    const last = skeletons.at(-1) as HTMLElement;
    const others = skeletons.slice(0, -1) as HTMLElement[];

    expect(others.every((el) => el.style.getPropertyValue('--skeleton-width') === '100%')).toBe(
      true,
    );
    expect(last.style.getPropertyValue('--skeleton-width')).not.toBe('100%');
  }}
/>

<Story
  name="Announces loading state to assistive tech"
  tags={['!dev', '!autodocs']}
  play={async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-component="skeleton-card"]') as HTMLElement;

    expect(card).toHaveAttribute('role', 'status');
    expect(card).toHaveAttribute('aria-label', 'Loading…');
  }}
/>

<Story
  name="Renders avatar layout with circle and text lines"
  tags={['!dev', '!autodocs']}
  args={{ layout: 'avatar', lines: 2 }}
  play={async ({ canvasElement }) => {
    const circle = canvasElement.querySelector(
      '[data-component="skeleton"][data-variant="circle"]',
    );
    const textLines = canvasElement.querySelectorAll(
      '[data-component="skeleton"][data-variant="text"]',
    );

    expect(circle).toBeTruthy();
    expect(textLines.length).toBe(2);
  }}
/>

<Story
  name="Renders sidebar-thumbnail layout with square thumbnail and text lines"
  tags={['!dev', '!autodocs']}
  args={{ layout: 'thumbnail', lines: 3 }}
  play={async ({ canvasElement }) => {
    const thumbnail = canvasElement.querySelector(
      '[data-component="skeleton"][data-variant="rect"]',
    );
    const textLines = canvasElement.querySelectorAll(
      '[data-component="skeleton"][data-variant="text"]',
    );

    expect(thumbnail).toBeTruthy();
    expect(textLines.length).toBe(3);
  }}
/>

<Story
  name="Renders media-block layout with full-width media and text lines"
  tags={['!dev', '!autodocs']}
  args={{ layout: 'media', lines: 3 }}
  play={async ({ canvasElement }) => {
    const media = canvasElement.querySelector(
      '[data-component="skeleton"][data-variant="rect"]',
    ) as HTMLElement;
    const textLines = canvasElement.querySelectorAll(
      '[data-component="skeleton"][data-variant="text"]',
    );

    expect(media?.style.getPropertyValue('--skeleton-height')).toBe('8rem');
    expect(textLines.length).toBe(3);
  }}
/>

<Story
  name="Renders stat-tile layout with label and value lines"
  tags={['!dev', '!autodocs']}
  args={{ layout: 'stat' }}
  play={async ({ canvasElement }) => {
    const textLines = canvasElement.querySelectorAll(
      '[data-component="skeleton"][data-variant="text"]',
    ) as NodeListOf<HTMLElement>;
    const heights = Array.from(textLines).map((el) =>
      el.style.getPropertyValue('--skeleton-height'),
    );

    expect(textLines.length).toBe(2);
    expect(heights).toContain('0.75em');
    expect(heights).toContain('1.75em');
  }}
/>
