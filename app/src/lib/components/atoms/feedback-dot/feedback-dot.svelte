<!--
  @component FeedbackDot

  Small circular indicator conveying semantic feedback status.
  Renders as `<span aria-hidden="true">` with colour driven by `data-status`.

  Use for inline-notification, timeline-item, and similar feedback contexts.
  For presence status (online/offline/busy/away) use StatusDot instead.

  @prop status - Feedback state. One of `'default' | 'success' | 'warning' | 'error' | 'info'`.
                 Default: `'default'`

  @example
  <FeedbackDot status="success" />
  <FeedbackDot status="error" />
-->
<script lang="ts">
  type Status = 'default' | 'success' | 'warning' | 'error' | 'info';

  interface Props {
    status?: Status;
  }

  let { status = 'default' }: Props = $props();
</script>

<span data-component="feedback-dot" aria-hidden="true" data-status={status}></span>

<style>
  [data-component='feedback-dot'] {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    flex-shrink: 0;
    background: currentColor;
  }

  [data-component='feedback-dot'][data-status='default'] {
    color: var(--text-muted, #6b7280);
  }
  [data-component='feedback-dot'][data-status='success'] {
    color: var(--success-text, #22c55e);
  }
  [data-component='feedback-dot'][data-status='warning'] {
    color: var(--warning-text, #f59e0b);
  }
  [data-component='feedback-dot'][data-status='error'] {
    color: var(--error-text, #ef4444);
  }
  [data-component='feedback-dot'][data-status='info'] {
    color: var(--info-text, #3b82f6);
  }
</style>
