export type Snapshot   = { step: number; vars: Record<string, number> };
export type StepResult = { final: Record<string, number>; timeline: Snapshot[] };
export type Rule = {
  variable: string,
  stepInc: string,
  stepDiv: string,
}
export interface IStepper { run(spec: string): StepResult; }