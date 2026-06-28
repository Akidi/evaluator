import { IStepper, StepResult } from "./types";

export class Stepper implements IStepper {
  run(spec: string): StepResult {
    throw new Error("Method not implemented.");
  }
  
}