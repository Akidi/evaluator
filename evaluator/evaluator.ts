import { Node } from "../parser/types";
import { CompareFn, EvalFn, FnEnv, IEvaluator, MathFn, VarEnv } from "./types";
import { EvaluatorError, InvalidOperandError, UndefinedVariableError } from "./errors";
import { Kind } from "../lexer/token";

export class Evaluator implements IEvaluator {
  private vars: VarEnv = new Map();
  private fns: FnEnv = new Map();
  private MATH_OPS: Map<Kind, MathFn> = new Map([
    ["PLUS", (a, b) => a + b],
    ["STAR", (a, b) => a * b]
  ]);
  private COMP_OPS: Map<Kind, CompareFn> = new Map([])

  setVar(name: string, value: number): void {
    this.vars.set(name, value);
  }

  defineFn(name: string, fn: EvalFn): void {
    this.fns.set(name, fn);
  }

  evaluate(ast: Node): number | boolean {
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
        const math_op = this.MATH_OPS.get(ast.op);
        // const comp_op = this.COMP_OPS.get(ast.op);
        const left = this.evaluate(ast.left);
        const right = this.evaluate(ast.right);
        if (math_op !== undefined && typeof left === 'number' && typeof right === 'number') {
          return math_op(left, right);
        }
        throw new EvaluatorError(`Unhandled Binary type: ${ast.op}`);
      }
    }

    throw new EvaluatorError(`Unhandled node type: ${ast.type}`);
  }
}