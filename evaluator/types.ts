import { Kind } from "../lexer/token";
import { IdentItem, Node } from "../parser/types";

export interface IEvaluator {
  evaluate(ast: Node, identList?: IdentItem[]): number | boolean;
  setVar(name: string, value: number): void;
  getVar(name: string): number | undefined;
  deleteVar(name: string): void;
  defineFn(name: string, fn: EvalFn, arity: number, variadic?: boolean): void;
}

export type EvalFn = (...args: number[]) => number | boolean;
export type VarEnv = Map<string, number>;
export type FnEntry = { fn: EvalFn; arity: number; variadic?: boolean };
export type FnEnv = Map<string, FnEntry>;

export type BinaryOpFn<R> = (a: number, b: number) => R;
export type MathFn = BinaryOpFn<number>;
export type CompareFn = BinaryOpFn<boolean>;