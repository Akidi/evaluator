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

export class ArityMismatchError extends EvaluatorError {
  constructor(fn: string, expected: number, received: number) {
    super(`Function ${fn} expects ${expected} argument(s) but received ${received}.`);
  }
}

export class FunctionRedefinitionError extends EvaluatorError {
  constructor(fn: string) {
    super(`Function ${fn} is already defined and cannot be redefined.`);
  }
}