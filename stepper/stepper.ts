import { UndefinedVariableError } from "../evaluator/errors";
import { IEvaluator } from "../evaluator/types";
import { Formulate, IFormulate } from "../formule";
import { IStepper, Rule, Snapshot, StepResult } from "./types";

export class Stepper implements IStepper {
  private formulate: IFormulate;

  constructor(private evaluator: IEvaluator) {
    this.formulate = new Formulate(evaluator);
  }

  run(spec: string): StepResult {
    let specs: string[] = spec.split(';');
    let steps: number = Number(specs.pop());
    let rules: Rule[] = specs.map(rule => { const [variable, stepInc, stepDiv] = rule.split('|').map(s => s.trim()); return { variable, stepInc, stepDiv: stepDiv } });
    return this.step(rules, steps);
  }

  private step(rules: Rule[], steps: number): StepResult {
    const timeline: Snapshot[] = [];
    for (let i = 0; i <= steps; i++) {
      let vars: Record<string, number> = {}
      rules.forEach(rule => {
        const { variable, stepInc, stepDiv } = rule;
        const currentVal = this.evaluator.getVar(variable);
        if (currentVal === undefined) throw new UndefinedVariableError(variable);
        vars[variable] = currentVal;
        if (i !== 0 && i % Number(stepDiv) === 0) {
          vars[variable] = currentVal + Number(this.formulate.run(stepInc));
        }
        this.evaluator.setVar(variable, vars[variable]);
      });
      timeline.push({
        step: i,
        vars,
      })
    }
    Object.entries(timeline[0].vars).forEach(([variable, value])=>{
      this.evaluator.setVar(variable, value);
    });
    return {
      final: timeline[timeline.length - 1].vars,
      timeline,
    }
  }
}