<script lang="ts">
  import { Tag } from '$lib/components/atoms';
  import { Stack } from '$lib/components/layouts';
  import Cluster from '$lib/components/layouts/cluster/Cluster.svelte';

  interface Props {
    tags?: string[];
    label?: string;
    placeholder?: string;
    ontagschange?: (tags: string[]) => void;
  }

  let { tags = [], label = 'Add tag', placeholder, ontagschange }: Props = $props();

  let internal = $derived(tags.slice());

  function onkeydown(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    const input = e.currentTarget as HTMLInputElement;
    const value = input.value.trim();
    if (!value || internal.includes(value)) return;
    internal = [...internal, value];
    input.value = '';
    ontagschange?.(internal);
  }

  function remove(i: number) {
    internal = internal.filter((_, idx) => idx !== i);
    ontagschange?.(internal);
  }
</script>

<Stack>
  <input type="text" aria-label={label} {placeholder} {onkeydown} />
  <Cluster data-component="tag-input">
    {#each internal as tag, i (i)}
      <Tag onremove={() => remove(i)}>{tag}</Tag>
    {/each}
  </Cluster>
</Stack>
