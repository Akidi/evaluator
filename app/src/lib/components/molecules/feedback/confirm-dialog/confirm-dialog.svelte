<script lang="ts">
  interface Props {
    title: string;
    description?: string;
    open?: boolean;
    variant?: 'danger';
    onconfirm?: () => void;
    oncancel?: () => void;
  }

  let { title, description, open = false, variant, onconfirm, oncancel }: Props = $props();
</script>

<dialog data-component="confirm-dialog" data-variant={variant} {open}>
  <p>{title}</p>
  {#if description}<p>{description}</p>{/if}
  <div>
    <button type="button" onclick={oncancel}>Cancel</button>
    <button type="button" onclick={onconfirm}>Confirm</button>
  </div>
</dialog>
