import { UndefinedVariableError } from "../evaluator/errors";
import type { IEvaluator } from "../evaluator/types";
import { Formulate, type IFormulate } from "../formule";
import type { IStepper, Rule, Snapshot, StepResult } from "./types";

export class Stepper implements IStepper {
  private formulate: IFormulate;

  constructor(private evaluator: IEvaluator) {
    this.formulate = new Formulate(evaluator);
  }

  run(spec: string): StepResult {
    let specs: string[] = spec.split(';');
    let steps: number = Number(specs.pop());
    let rules: Rule[] = specs.map(rule => { const [variable, stepInc, stepDiv, noInc] = rule.split('|').map(s => s.trim()); return { variable, stepInc, stepDiv, noInc  } });
    return this.step(rules, steps);
  }

  private step(rules: Rule[], steps: number): StepResult {
    const timeline: Snapshot[] = [];
    const working = new Map<string, number>();

    // seed once from the evaluator — the only place a var can genuinely be missing
    rules.forEach(rule => {
      const opening = this.evaluator.getVar(rule.variable);
      if (opening === undefined) throw new UndefinedVariableError(rule.variable);
      working.set(rule.variable, opening);
    });

    for (let i = 0; i <= steps; i++) {
      rules.forEach(({ variable, stepInc, stepDiv, noInc }) => {
        const currentVal = working.get(variable)!; // seeded above → always defined
        const shouldStep = i !== 0 && i % Number(stepDiv) === 0 && !(noInc === "false");
        const nextVal = shouldStep
          ? currentVal + Number(this.formulate.run(stepInc, working))
          : currentVal;
        working.set(variable, nextVal); // in-place: later rules see earlier updates
      });
      timeline.push({ step: i, vars: Object.fromEntries(working) }); // snapshot a COPY
    }

    return {
      final: timeline[timeline.length - 1].vars,
      timeline,
    };
  }
}