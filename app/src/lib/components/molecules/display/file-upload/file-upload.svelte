<!--
  @component FileUpload

  Drag-and-drop file picker with state-driven UI. Validates against `accept`
  extensions and shows a selected-file row or an error zone on invalid type.

  @prop accept        - Comma-separated list of accepted file extensions (e.g. `'.csv,.xlsx'`).
                        Default: `'.csv'`
  @prop label         - Text shown inside the drop zone. Default: `'Drop your CSV here'`
  @prop hint          - Helper text below the drop zone. Default: `undefined`
  @prop onchange      - Called with the valid `File` when one is selected. Default: `undefined`
  @prop style         - Inline style applied to the wrapper element. Default: `''`
  @prop initialState  - Starting UI state for Storybook. One of `'empty' | 'dragover' | 'selected' | 'error'`.
                        Default: `'empty'`
  @prop initialFile   - Pre-selected file for Storybook `selected` state. Default: `undefined`

  @example Basic
  <FileUpload onchange={(file) => console.log(file)} />

  @example Custom accept and hint
  <FileUpload accept=".csv,.xlsx" hint="Max file size 10 MB" onchange={handleFile} />
-->
<script lang="ts">
  type UploadState = 'empty' | 'dragover' | 'selected' | 'error';

  interface Props {
    accept?: string;
    label?: string;
    hint?: string;
    onchange?: (file: File) => void;
    style?: string;
    initialState?: UploadState;
    initialFile?: File;
  }

  let {
    accept = '.csv',
    label = 'Drop your CSV here',
    hint,
    onchange,
    style = '',
    initialState = 'empty',
    initialFile,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let uploadState: UploadState = $state(initialState);
  // svelte-ignore state_referenced_locally
  let selectedFile: File | null = $state(initialFile ?? null);
  let inputEl: HTMLInputElement;

  function isValidFile(file: File): boolean {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    return accept
      .split(',')
      .map((a) => a.trim())
      .includes(ext);
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function selectFile(file: File) {
    if (!isValidFile(file)) {
      uploadState = 'error';
      selectedFile = null;
      inputEl.value = '';
      return;
    }
    uploadState = 'selected';
    selectedFile = file;
    onchange?.(file);
  }

  function handleInputChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) selectFile(file);
  }

  function removeFile() {
    uploadState = 'empty';
    selectedFile = null;
    inputEl.value = '';
  }

  function handleRemoveKeydown(e: KeyboardEvent) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      removeFile();
    }
  }

  function resetAndBrowse() {
    uploadState = 'empty';
    inputEl.click();
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (uploadState !== 'selected') uploadState = 'dragover';
  }

  function handleDragLeave() {
    if (uploadState === 'dragover') uploadState = 'empty';
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file) {
      if (uploadState === 'dragover') uploadState = 'empty';
      return;
    }
    selectFile(file);
  }
</script>

<input
  bind:this={inputEl}
  type="file"
  {accept}
  style="display:none"
  aria-invalid={uploadState === 'error' ? 'true' : undefined}
  onchange={handleInputChange}
/>

<div class="sf-upload" {style}>
  {#if uploadState === 'selected' && selectedFile}
    <div class="sf-upload__row" role="group" aria-label="Selected file">
      <span aria-hidden="true">📄</span>
      <span class="sf-upload__filename">{selectedFile.name}</span>
      <span class="sf-upload__size">{formatSize(selectedFile.size)}</span>
      <button
        class="sf-upload__remove"
        type="button"
        aria-label="Remove {selectedFile.name}"
        onclick={removeFile}
        onkeydown={handleRemoveKeydown}>✕</button
      >
    </div>
  {:else if uploadState === 'error'}
    <button
      class="sf-upload__zone sf-upload__zone--error"
      type="button"
      aria-label={label}
      onclick={resetAndBrowse}
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
    >
      <span aria-hidden="true">⚠️</span>
      <span>Wrong file type</span>
      <span>Only CSV files are supported</span>
      <span class="sf-upload__browse sf-upload__browse--error" aria-hidden="true">Try again</span>
    </button>
  {:else}
    <button
      class="sf-upload__zone"
      class:sf-upload__zone--dragover={uploadState === 'dragover'}
      type="button"
      aria-label={label}
      onclick={() => inputEl.click()}
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
    >
      <span aria-hidden="true">📄</span>
      <span>{label}</span>
      <span>or click to browse</span>
      <span class="sf-upload__browse" aria-hidden="true">Browse files</span>
    </button>
  {/if}

  {#if hint}
    <span class="sf-upload__hint">{hint}</span>
  {/if}
</div>

<style>
  .sf-upload {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .sf-upload__hint {
    font-size: var(--text-sm, 0.875rem);
    color: var(--text-muted);
  }

  .sf-upload__zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-8) var(--space-4);
    border: 2px dashed var(--sf-upload-border, var(--primary-border));
    border-radius: var(--sf-upload-radius, var(--radius-lg));
    background: var(--sf-upload-bg, var(--primary-bg-subtle));
    cursor: pointer;
    font: inherit;
    transition:
      border-color var(--duration-fast) var(--ease-default),
      border-width var(--duration-fast) var(--ease-default),
      background var(--duration-fast) var(--ease-default),
      box-shadow var(--duration-fast) var(--ease-default),
      transform var(--duration-fast) var(--ease-default);
  }

  @media (prefers-reduced-motion: reduce) {
    .sf-upload__zone {
      transition: none;
    }
  }

  .sf-upload__zone:focus-visible {
    outline: 2px solid var(--primary-ring);
    outline-offset: 2px;
  }

  .sf-upload__browse {
    display: inline-block;
    padding: var(--space-1) var(--space-4);
    background: var(--primary);
    color: var(--primary-fg);
    border-radius: var(--radius-lg);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-medium, 500);
    margin-top: var(--space-1);
  }

  .sf-upload__row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-block-size: 2.75rem;
    padding-inline: var(--space-3);
    border: 1px solid var(--border);
    border-radius: var(--sf-upload-radius, var(--radius-lg));
    background: var(--surface-raised);
  }

  .sf-upload__filename {
    flex: 1;
    font-size: var(--text-sm, 0.875rem);
    color: var(--text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sf-upload__size {
    font-size: var(--text-sm, 0.875rem);
    color: var(--text-muted);
    white-space: nowrap;
  }

  .sf-upload__zone--dragover {
    border-color: var(--sf-upload-border-active, var(--primary));
    border-width: 3px;
    background: var(--primary-bg-subtle);
    box-shadow: 0 0 0 4px var(--primary-ring);
    transform: scale(1.01);
  }

  .sf-upload__zone--error {
    border-color: var(--sf-upload-error-border, var(--error));
    background: var(--sf-upload-error-bg, var(--error-bg-subtle));
    color: var(--sf-upload-error-color, var(--error-text));
    font-weight: var(--font-medium, 500);
  }

  .sf-upload__browse--error {
    background: var(--error);
    color: #fff;
  }

  .sf-upload__remove {
    display: flex;
    align-items: center;
    justify-content: center;
    min-block-size: 2.75rem;
    min-inline-size: 2.75rem;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: var(--text-base);
    border-radius: var(--radius-lg);
  }

  .sf-upload__remove:hover {
    color: var(--text);
    background: var(--surface-sunken);
  }

  .sf-upload__remove:focus-visible {
    outline: 2px solid var(--primary-ring);
    outline-offset: 2px;
  }
</style>
