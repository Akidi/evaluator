import { Kind } from "../lexer/token";
import { Node } from "../parser/types";

export interface IEvaluator {
  evaluate(ast: Node): number | boolean;
  setVar(name: string, value: number): void;
  defineFn(name: string, fn: EvalFn): void;
}

export type EvalFn = (...args: unknown[]) => number | boolean;
export type VarEnv = Map<string, number>;
export type FnEnv = Map<string, EvalFn>;

export type BinaryOpFn<R> = (a: number, b: number) => R;
export type MathFn = BinaryOpFn<number>;
export type CompareFn = BinaryOpFn<boolean>;