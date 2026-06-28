export type Snapshot   = { step: number; vars: Record<string, number> };
export type StepResult = { final: Record<string, number>; timeline: Snapshot[] };
export interface IStepper { run(spec: string): StepResult; }