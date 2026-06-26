import { Node } from "../parser/types";

export interface IEvaluator {
  evaluate(ast: Node): number | boolean;
}

export type EvalFn = (...args: unknown[]) => number | boolean;
export type VarEnv = Map<string, number>;
export type FnEnv = Map<string, EvalFn>;