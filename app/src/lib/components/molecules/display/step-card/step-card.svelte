<!--
  @component StepCard

  Numbered recipe step. Renders the step number beside the instruction content.

  @prop step     - Step number (1-based).
  @prop children - Instruction text or content.

  @example
  <StepCard step={1}>Preheat the oven to 200°C.</StepCard>

  @example
  <StepCard step={2}>Season chicken with salt and pepper on both sides.</StepCard>
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Cluster } from '$lib/components/layouts';

  interface Props {
    step: number;
    children: Snippet;
  }

  let { step, children }: Props = $props();
</script>

<Cluster data-component="step-card" space="var(--space-3)" align="baseline">
  <span data-step-number>{step}</span>
  <div data-step-content>{@render children()}</div>
</Cluster>
