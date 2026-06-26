import { describe, expect, it } from "vitest";
import { Evaluator } from "./evaluator";
import { IEvaluator } from "./types";
import { ArityMismatchError, EvaluatorError, FunctionRedefinitionError, InvalidOperandError, UndefinedFunctionError, UndefinedVariableError } from "./errors";
import { ILexer, Lexer } from "../lexer/lexer";
import { IParser } from "../parser/types";
import { Parser } from "../parser/parser";

const evaluator: IEvaluator = new Evaluator();
const lexer = new Lexer();
const parser = new Parser();


describe("Evaluator", () => {
  it("evaluates a Num node to its value", () => {
    expect(evaluator.evaluate({ type: "Num", value: 1 })).toBe(1);
  });

  it("evaluates an Ident node to its assigned value", () => {
    evaluator.setVar("x", 5);

    expect(evaluator.evaluate({ type: "Ident", name: "x" })).toBe(5);
  });

  it("throws UndefinedVariableError for an unassigned Ident", () => {
    expect(() => evaluator.evaluate({ type: "Ident", name: "y" })).toThrow(UndefinedVariableError);
  });

  it("evaluates a Unary MINUS node by negating its operand", () => {
    expect(evaluator.evaluate({
      type: "Unary",
      op: "MINUS",
      operand: { type: "Num", value: 4 },
    })).toBe(-4);
  });

  it("evaluates a Unary MINUS node by negating a non-literal operand (Ident)", () => {
    const evaluator: IEvaluator = new Evaluator();
    evaluator.setVar("x", 5);

    expect(evaluator.evaluate({
      type: "Unary",
      op: "MINUS",
      operand: { type: "Ident", name: "x" },
    })).toBe(-5);
  });

  it("throws InvalidOperandError for a Unary NOT on a non-boolean operand", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(() => evaluator.evaluate({
      type: "Unary",
      op: "NOT",
      operand: { type: "Num", value: 0 },
    })).toThrow(InvalidOperandError);
  });

  it("evaluates a Binary PLUS node by adding both operands", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "PLUS",
      left: { type: "Num", value: 2 },
      right: { type: "Num", value: 3 },
    })).toBe(5);
  });

  it("evaluates a Binary STAR node by multiplying both operands", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "STAR",
      left: { type: "Num", value: 2 },
      right: { type: "Num", value: 3 },
    })).toBe(6);
  });

  it("throws a Binary-specific error for an op not yet wired into MATH_OPS/COMP_OPS, distinct from the generic unhandled-node-type error", () => {
    const evaluator: IEvaluator = new Evaluator();
    let caught: unknown;

    try {
      evaluator.evaluate({
        type: "Binary",
        op: "AND",
        left: { type: "Num", value: 1 },
        right: { type: "Num", value: 0 },
      });
    } catch (e) {
      caught = e;
    }

    expect(caught).toBeInstanceOf(EvaluatorError);
    expect((caught as Error).message).not.toMatch(/Unhandled node type/);
  });

  it("evaluates a Binary EQ node comparing equal operands to true", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "EQ",
      left: { type: "Num", value: 3 },
      right: { type: "Num", value: 3 },
    })).toBe(true);
  });

  it("evaluates a Binary EQ node comparing unequal operands to false", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "EQ",
      left: { type: "Num", value: 3 },
      right: { type: "Num", value: 4 },
    })).toBe(false);
  });

  it("evaluates a Binary NEQ node comparing unequal operands to true", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "NEQ",
      left: { type: "Num", value: 3 },
      right: { type: "Num", value: 4 },
    })).toBe(true);
  });

  it("evaluates a Binary NEQ node comparing equal operands to false", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "NEQ",
      left: { type: "Num", value: 3 },
      right: { type: "Num", value: 3 },
    })).toBe(false);
  });

  it("evaluates a Binary LT node to true when left is less than right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "LT",
      left: { type: "Num", value: 2 },
      right: { type: "Num", value: 3 },
    })).toBe(true);
  });

  it("evaluates a Binary LT node to false when left is not less than right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "LT",
      left: { type: "Num", value: 3 },
      right: { type: "Num", value: 3 },
    })).toBe(false);
  });

  it("evaluates a Binary LTE node to true when left equals right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "LTE",
      left: { type: "Num", value: 3 },
      right: { type: "Num", value: 3 },
    })).toBe(true);
  });

  it("evaluates a Binary LTE node to false when left is greater than right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "LTE",
      left: { type: "Num", value: 4 },
      right: { type: "Num", value: 3 },
    })).toBe(false);
  });

  it("evaluates a Binary GT node to true when left is greater than right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "GT",
      left: { type: "Num", value: 4 },
      right: { type: "Num", value: 3 },
    })).toBe(true);
  });

  it("evaluates a Binary GT node to false when left is not greater than right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "GT",
      left: { type: "Num", value: 3 },
      right: { type: "Num", value: 3 },
    })).toBe(false);
  });

  it("evaluates a Binary GTE node to true when left equals right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "GTE",
      left: { type: "Num", value: 3 },
      right: { type: "Num", value: 3 },
    })).toBe(true);
  });

  it("evaluates a Binary GTE node to false when left is less than right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "GTE",
      left: { type: "Num", value: 2 },
      right: { type: "Num", value: 3 },
    })).toBe(false);
  });

  it("evaluates a Unary NOT node by inverting a real Binary comparison result", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Unary",
      op: "NOT",
      operand: {
        type: "Binary",
        op: "EQ",
        left: { type: "Num", value: 3 },
        right: { type: "Num", value: 4 },
      },
    })).toBe(true);
  });

  it("evaluates a Binary MINUS node by subtracting right from left", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "MINUS",
      left: { type: "Num", value: 5 },
      right: { type: "Num", value: 3 },
    })).toBe(2);
  });

  it("evaluates a Binary SLASH node by dividing left by right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "SLASH",
      left: { type: "Num", value: 6 },
      right: { type: "Num", value: 3 },
    })).toBe(2);
  });

  it("evaluates a Binary PERCENT node by taking left modulo right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "PERCENT",
      left: { type: "Num", value: 7 },
      right: { type: "Num", value: 3 },
    })).toBe(1);
  });

  it("evaluates a Binary CARROT node by raising left to the power of right", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "CARROT",
      left: { type: "Num", value: 2 },
      right: { type: "Num", value: 3 },
    })).toBe(8);
  });

  it("evaluates a Binary AND node to true when both operands are true", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "AND",
      left: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 1 } },
      right: { type: "Binary", op: "EQ", left: { type: "Num", value: 2 }, right: { type: "Num", value: 2 } },
    })).toBe(true);
  });

  it("evaluates a Binary AND node to false when the left operand is false", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "AND",
      left: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 2 } },
      right: { type: "Binary", op: "EQ", left: { type: "Num", value: 2 }, right: { type: "Num", value: 2 } },
    })).toBe(false);
  });

  it("short-circuits a Binary AND node, never evaluating the right operand when the left is false", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "AND",
      left: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 2 } },
      right: { type: "Ident", name: "undefined_var" },
    })).toBe(false);
  });

  it("evaluates a Binary OR node to true when the left operand is true", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "OR",
      left: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 1 } },
      right: { type: "Binary", op: "EQ", left: { type: "Num", value: 2 }, right: { type: "Num", value: 3 } },
    })).toBe(true);
  });

  it("evaluates a Binary OR node to false when both operands are false", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "OR",
      left: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 2 } },
      right: { type: "Binary", op: "EQ", left: { type: "Num", value: 2 }, right: { type: "Num", value: 3 } },
    })).toBe(false);
  });

  it("short-circuits a Binary OR node, never evaluating the right operand when the left is true", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "OR",
      left: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 1 } },
      right: { type: "Ident", name: "undefined_var" },
    })).toBe(true);
  });

  it("throws InvalidOperandError for a Binary AND with a non-boolean left operand", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(() => evaluator.evaluate({
      type: "Binary",
      op: "AND",
      left: { type: "Num", value: 1 },
      right: { type: "Binary", op: "EQ", left: { type: "Num", value: 2 }, right: { type: "Num", value: 2 } },
    })).toThrow(InvalidOperandError);
  });

  it("evaluates a Ternary node to ifTrue when the test is true", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Ternary",
      test: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 1 } },
      ifTrue: { type: "Num", value: 10 },
      ifFalse: { type: "Num", value: 20 },
    })).toBe(10);
  });

  it("evaluates a Ternary node to ifFalse when the test is false", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Ternary",
      test: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 2 } },
      ifTrue: { type: "Num", value: 10 },
      ifFalse: { type: "Num", value: 20 },
    })).toBe(20);
  });

  it("never evaluates ifFalse when the Ternary test is true", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Ternary",
      test: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 1 } },
      ifTrue: { type: "Num", value: 10 },
      ifFalse: { type: "Ident", name: "undefined_var" },
    })).toBe(10);
  });

  it("never evaluates ifTrue when the Ternary test is false", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Ternary",
      test: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 2 } },
      ifTrue: { type: "Ident", name: "undefined_var" },
      ifFalse: { type: "Num", value: 20 },
    })).toBe(20);
  });

  it("throws InvalidOperandError for a Ternary with a non-boolean test", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(() => evaluator.evaluate({
      type: "Ternary",
      test: { type: "Num", value: 1 },
      ifTrue: { type: "Num", value: 10 },
      ifFalse: { type: "Num", value: 20 },
    })).toThrow(InvalidOperandError);
  });

  it("evaluates a Call node by invoking the defined function with evaluated args", () => {
    const evaluator: IEvaluator = new Evaluator();
    evaluator.defineFn("add", (...args) => (args[0] as number) + (args[1] as number), 2);

    expect(evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "add" },
      args: [{ type: "Num", value: 2 }, { type: "Num", value: 3 }],
    })).toBe(5);
  });

  it("evaluates a Call node with zero args", () => {
    const evaluator: IEvaluator = new Evaluator();
    evaluator.defineFn("always_true", () => true, 0);

    expect(evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "always_true" },
      args: [],
    })).toBe(true);
  });

  it("throws UndefinedFunctionError for a Call to an undefined function", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(() => evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "missing_fn" },
      args: [],
    })).toThrow(UndefinedFunctionError);
  });

  it("evaluates a Call node when arg count matches the declared arity", () => {
    const evaluator: IEvaluator = new Evaluator();
    evaluator.defineFn("add", (...args) => (args[0] as number) + (args[1] as number), 2);

    expect(evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "add" },
      args: [{ type: "Num", value: 2 }, { type: "Num", value: 3 }],
    })).toBe(5);
  });

  it("throws ArityMismatchError when a Call has too few args for the declared arity", () => {
    const evaluator: IEvaluator = new Evaluator();
    evaluator.defineFn("add", (...args) => (args[0] as number) + (args[1] as number), 2);

    expect(() => evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "add" },
      args: [{ type: "Num", value: 2 }],
    })).toThrow(ArityMismatchError);
  });

  it("throws ArityMismatchError when a Call has too many args for the declared arity", () => {
    const evaluator: IEvaluator = new Evaluator();
    evaluator.defineFn("add", (...args) => (args[0] as number) + (args[1] as number), 2);

    expect(() => evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "add" },
      args: [{ type: "Num", value: 2 }, { type: "Num", value: 3 }, { type: "Num", value: 4 }],
    })).toThrow(ArityMismatchError);
  });

  it("evaluates calls to prepopulated built-in Math functions", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "sqrt" },
      args: [{ type: "Num", value: 9 }],
    })).toBe(3);

    expect(evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "pow" },
      args: [{ type: "Num", value: 2 }, { type: "Num", value: 3 }],
    })).toBe(8);
  });

  it("evaluates a variadic built-in (max) with more args than its declared arity", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "max" },
      args: [{ type: "Num", value: 1 }, { type: "Num", value: 5 }, { type: "Num", value: 3 }],
    })).toBe(5);
  });

  it("evaluates a variadic built-in (min) with exactly its minimum arg count", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "min" },
      args: [{ type: "Num", value: 7 }],
    })).toBe(7);
  });

  it("throws ArityMismatchError for a fixed-arity built-in called with the wrong number of args", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(() => evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "sqrt" },
      args: [{ type: "Num", value: 9 }, { type: "Num", value: 1 }],
    })).toThrow(ArityMismatchError);
  });

  it("throws ArityMismatchError for a variadic built-in called below its minimum arg count", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(() => evaluator.evaluate({
      type: "Call",
      callee: { type: "Ident", name: "max" },
      args: [],
    })).toThrow(ArityMismatchError);
  });

  it("throws FunctionRedefinitionError when defineFn targets an existing built-in name", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(() => evaluator.defineFn("sqrt", (...args) => (args[0] as number) * 2, 1))
      .toThrow(FunctionRedefinitionError);
  });

  it("throws FunctionRedefinitionError when defineFn targets an already user-defined name", () => {
    const evaluator: IEvaluator = new Evaluator();
    evaluator.defineFn("double", (...args) => (args[0] as number) * 2, 1);

    expect(() => evaluator.defineFn("double", (...args) => (args[0] as number) * 3, 1))
      .toThrow(FunctionRedefinitionError);
  });

  it("evaluates successfully when an identList is passed and every VAR/FN ident resolves", () => {
    const evaluator: IEvaluator = new Evaluator();
    evaluator.setVar("x", 4);

    expect(evaluator.evaluate(
      { type: "Binary", op: "PLUS", left: { type: "Ident", name: "x" }, right: { type: "Num", value: 1 } },
      [{ name: "x", type: "VAR" }],
    )).toBe(5);
  });

  it("throws UndefinedVariableError up front when identList flags a VAR that was never setVar'd, even on an unevaluated branch", () => {
    const evaluator: IEvaluator = new Evaluator();
    evaluator.setVar("x", 4);

    expect(() => evaluator.evaluate(
      {
        type: "Ternary",
        test: { type: "Binary", op: "EQ", left: { type: "Num", value: 1 }, right: { type: "Num", value: 1 } },
        ifTrue: { type: "Ident", name: "x" },
        ifFalse: { type: "Ident", name: "never_set" },
      },
      [{ name: "x", type: "VAR" }, { name: "never_set", type: "VAR" }],
    )).toThrow(UndefinedVariableError);
  });

  it("throws UndefinedFunctionError up front when identList flags a FN that was never defined", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(() => evaluator.evaluate(
      { type: "Call", callee: { type: "Ident", name: "missing_fn" }, args: [] },
      [{ name: "missing_fn", type: "FN" }],
    )).toThrow(UndefinedFunctionError);
  });

  it("does not validate idents when identList is omitted (existing per-node lazy errors still apply)", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(() => evaluator.evaluate({ type: "Ident", name: "y" })).toThrow(UndefinedVariableError);
  });

  it("evaluates a full-pipeline stress-test formula covering every node/op type with custom vars and functions", () => {
    const lexer: ILexer = new Lexer();
    const parser: IParser = new Parser();
    const evaluator: IEvaluator = new Evaluator();

    evaluator.setVar("a", 3);
    evaluator.setVar("b", 5);
    evaluator.setVar("c", 2);

    // avg/clamp are deliberately not in MATH_OPS/COMP_OPS — they exercise Call
    // with real custom logic, distinct from the table-driven binary ops.
    evaluator.defineFn("avg", (...args) => ((args[0] as number) + (args[1] as number)) / 2, 2);
    evaluator.defineFn("clamp", (...args) => {
      const [value, lo, hi] = args as number[];
      return Math.min(Math.max(value, lo), hi);
    }, 3);

    const formula = "avg(a, b) + clamp(10, 0, c) * b - a ^ c == 7 ? !(a < b) || c >= b : a != b && b > c";

    // avg(3,5)=4; clamp(10,0,2)=2; 4 + 2*5 - 3^2 = 4 + 10 - 9 = 5; 5 == 7 is false
    // -> ifFalse branch: (a != b) && (b > c) -> (3 != 5) && (5 > 2) -> true && true -> true
    const [ast] = parser.parse(lexer.scan(formula));
    expect(evaluator.evaluate(ast)).toBe(true);
  });
});
