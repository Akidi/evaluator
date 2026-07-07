<!--
  @component SearchField

  Accessible search input with a visually hidden label and an inline search button.
  Calls `onSearch` when the button is clicked or Enter is pressed.

  @prop label       - Accessible label for the input (visually hidden). Required.
  @prop placeholder - Input placeholder text.
  @prop disabled    - Disables the input and button when true. Default: `false`
  @prop onSearch    - Called with the current input value on submit.

  @example
  <SearchField
    label="Search recipes"
    placeholder="e.g. pasta, chicken..."
    onSearch={(q) => search(q)}
  />
-->
<script lang="ts" module>
  const nextId = (() => {
    let n = 0;
    return () => `search-field-input-${n++}`;
  })();
</script>

<script lang="ts">
  import { Input, Button, VisuallyHidden } from '$lib/components/atoms';

  interface Props {
    label: string;
    placeholder?: string;
    disabled?: boolean;
    onSearch?: (value: string) => void;
  }

  let { label, placeholder, disabled = false, onSearch, ...rest }: Props = $props();

  const inputId = nextId();

  let value = $state('');

  function handleSearch() {
    if (!disabled) onSearch?.(value);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleSearch();
  }
</script>

<div data-component="search-field" {...rest}>
  <VisuallyHidden>
    <label for={inputId}>{label}</label>
  </VisuallyHidden>
  <div data-search-field-container>
    <Input
      inputType="search"
      id={inputId}
      {placeholder}
      {disabled}
      bind:value
      oninput={(e) => {
        value = (e.currentTarget as HTMLInputElement).value;
      }}
      onkeydown={handleKeydown}
    />
    <Button variant="ghost" {disabled} onclick={handleSearch} data-search-field-button
      >Search</Button
    >
  </div>
</div>

<style>
  [data-search-field-container] {
    display: flex;
    align-items: stretch;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition:
      border-color var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default);
  }

  [data-search-field-container]:focus-within {
    border-color: var(--primary-border-emphasis);
    box-shadow: 0 0 0 var(--focus-ring-width) var(--focus-ring);
  }

  [data-component='search-field'] :global(.input-wrapper) {
    flex: 1;
    border: none;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  [data-component='search-field'] :global(.input-wrapper:focus-within) {
    border-color: transparent;
    box-shadow: none;
  }

  [data-component='search-field'] :global([data-search-field-button]) {
    border-radius: 0;
    border: none;
    border-inline-start: 1px solid var(--border);
    padding-inline: var(--space-4);
  }
</style>
