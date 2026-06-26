import { IdentItem, Node } from "../parser/types";
import { CompareFn, EvalFn, FnEnv, IEvaluator, MathFn, VarEnv } from "./types";
import { ArityMismatchError, EvaluatorError, FunctionRedefinitionError, InvalidOperandError, UndefinedFunctionError, UndefinedVariableError } from "./errors";
import { Kind } from "../lexer/token";

const BUILT_IN_FNS: FnEnv = new Map([
  ["sqrt", { fn: (...args) => Math.sqrt(args[0] as number), arity: 1 }],
  ["abs", { fn: (...args) => Math.abs(args[0] as number), arity: 1 }],
  ["pow", { fn: (...args) => Math.pow(args[0] as number, args[1] as number), arity: 2 }],
  ["floor", { fn: (...args) => Math.floor(args[0] as number), arity: 1 }],
  ["ceil", { fn: (...args) => Math.ceil(args[0] as number), arity: 1 }],
  ["round", { fn: (...args) => Math.round(args[0] as number), arity: 1 }],
  ["log", { fn: (...args) => Math.log(args[0] as number), arity: 1 }],
  ["exp", { fn: (...args) => Math.exp(args[0] as number), arity: 1 }],
  ["min", { fn: (...args) => Math.min(...(args as number[])), arity: 1, variadic: true }],
  ["max", { fn: (...args) => Math.max(...(args as number[])), arity: 1, variadic: true }],
]);

export class Evaluator implements IEvaluator {
  private vars: VarEnv = new Map();
  private fns: FnEnv = new Map(BUILT_IN_FNS);
  private MATH_OPS: Map<Kind, MathFn> = new Map([
    ["PLUS", (a, b) => a + b],
    ["STAR", (a, b) => a * b],
    ["MINUS", (a, b) => a - b],
    ["SLASH", (a, b) => a / b],
    ["CARROT", (a, b) => a**b],
    ["PERCENT", (a, b) => a % b]
  ]);
  private COMP_OPS: Map<Kind, CompareFn> = new Map([
    ["EQ", (a, b) => a === b],
    ["NEQ", (a, b) => a !== b],
    ["LT", (a, b) => a < b],
    ["LTE", (a, b) => a <= b],
    ["GT", (a, b) => a > b],
    ["GTE", (a, b) => a >= b] 
  ])

  setVar(name: string, value: number): void {
    this.vars.set(name, value);
  }

  defineFn(name: string, fn: EvalFn, arity: number, variadic?: boolean): void {
    if (this.fns.has(name)) throw new FunctionRedefinitionError(name);
    this.fns.set(name, { fn, arity, variadic });
  }

  evaluate(ast: Node, identList?: IdentItem[]): number | boolean {
    if (identList !== undefined) this.validate(identList);
    return this.evalNode(ast);
  }

  private validate(identList: IdentItem[]): void {
    for (const ident of identList) {
      if (ident.type === 'VAR' && !this.vars.has(ident.name)) {
        throw new UndefinedVariableError(ident.name);
      }
      if (ident.type === 'FN' && !this.fns.has(ident.name)) {
        throw new UndefinedFunctionError(ident.name);
      }
    }
  }

  private evalNode(ast: Node): number | boolean {
    switch (ast.type) {
      case "Num":
        return ast.value * 1;
      case "Ident": {
        const value = this.vars.get(ast.name);
        if (value === undefined) {
          throw new UndefinedVariableError(ast.name);
        }
        return value;
      }
      case "Unary": {
        let result = this.evaluate(ast.operand);
        if ((ast.op === "MINUS" && typeof result === "number")) return -result;
        if ((ast.op === "NOT" && typeof result === "boolean")) return !result;
 
        throw new InvalidOperandError(String(ast.op), (ast.op === 'MINUS' ? 'Number' : 'Boolean'));
      }
      case "Binary":{
        if (ast.op === "AND" || ast.op === "OR") {
          const left = this.evaluate(ast.left);
          if (typeof left !== 'boolean') throw new InvalidOperandError(ast.op, 'boolean');
          if (
            (ast.op === "AND" && !left)
            || (ast.op === "OR" && left)
          ) return left;
          const right = this.evaluate(ast.right);
          if (typeof right !== 'boolean') throw new InvalidOperandError(ast.op, 'boolean');
          return right;
        }
        const math_op = this.MATH_OPS.get(ast.op);
        const comp_op = this.COMP_OPS.get(ast.op);
        const left = this.evaluate(ast.left);
        const right = this.evaluate(ast.right);

        if (math_op !== undefined && typeof left === 'number' && typeof right === 'number') {
          return math_op(left, right);
        } else if (comp_op !== undefined && typeof left === 'number' && typeof right === 'number') {
          return comp_op(left, right);
        }

        throw new EvaluatorError(`Unhandled Binary type: ${ast.op}`);
      }
      case 'Call': {
        const entry = this.fns.get(ast.callee.name);
        if (entry === undefined) throw new UndefinedFunctionError(ast.callee.name);
        const arityMatches = entry.variadic ? ast.args.length >= entry.arity : ast.args.length === entry.arity;
        if (!arityMatches) {
          throw new ArityMismatchError(ast.callee.name, entry.arity, ast.args.length);
        }
        return entry.fn(...ast.args.map(node => this.evaluate(node)));
      }

      case 'Ternary': {
        const test = this.evaluate(ast.test);
        if (typeof test === 'number') throw new InvalidOperandError(ast.type, 'boolean');
        if (!test) return this.evaluate(ast.ifFalse)
        return this.evaluate(ast.ifTrue);
      }
    }
  }
}