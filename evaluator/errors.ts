import { ProjectError } from "../shared/errors";

export class EvaluatorError extends ProjectError {
  constructor(message: string) {
    super(message);
  }
}

export class UndefinedVariableError extends EvaluatorError {
  constructor(variable: string) {
    super(`Variable ${variable} is undefined.`);
  }
}

export class UndefinedFunctionError extends EvaluatorError {
  constructor(fn: string) {
    super(`Function ${fn} is undefined.`)
  }
}

export class InvalidOperandError extends EvaluatorError {
  constructor(op: string, expected: string) {
    super(`Operand for ${op} must be ${expected}.`);
  }
}