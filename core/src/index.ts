// Public API for @formula/core

// Facade
export { Formulate } from "./formule";
export type { IFormulate } from "./formule";

// Engine pieces
export { Lexer } from "./lexer/lexer";
export { Parser } from "./parser/parser";
export { Evaluator } from "./evaluator/evaluator";
export { Stepper } from "./stepper/stepper";

// Types
export type { ILexer } from "./lexer/types";
export type { IParser } from "./parser/types";
export type { IEvaluator, Scope, EvalFn } from "./evaluator/types";
export type { IStepper, Rule, Snapshot, StepResult } from "./stepper/types";

// Errors
export { ProjectError } from "./shared/errors";
export {
  EvaluatorError,
  UndefinedVariableError,
  UndefinedFunctionError,
  InvalidOperandError,
  ArityMismatchError,
  FunctionRedefinitionError,
  DivisionByZeroError,
} from "./evaluator/errors";
